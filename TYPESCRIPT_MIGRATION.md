# TypeScript Migration Guide

## Overview

This guide outlines the steps to convert the Parkville Luxury Kiosk from JavaScript to TypeScript.

## Why TypeScript?

- **Type Safety**: Catch errors at compile-time instead of runtime
- **Better IDE Support**: Autocomplete, refactoring, inline documentation
- **Self-Documenting Code**: Types serve as inline documentation
- **Refactoring Confidence**: Easier to rename/restructure with type safety
- **Long-term Maintainability**: Reduces bugs in production

## Migration Steps

### Phase 1: Setup (1-2 hours)

1. **Install TypeScript**
   ```bash
   npm install --save-dev typescript @types/react @types/react-dom @types/node
   npx tsc --init
   ```

2. **Update tsconfig.json**
   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "jsx": "react-jsx",
       "module": "ESNext",
       "moduleResolution": "bundler",
       "strict": true,
       "esModuleInterop": true,
       "resolveJsonModule": true,
       "skipLibCheck": true,
       "forceConsistentCasingInFileNames": true
     },
     "include": ["src"],
     "exclude": ["node_modules"]
   }
   ```

3. **Update ESLint** (already configured, just add TS support)
   ```bash
   npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser
   ```

4. **Rename files** from `.jsx` → `.tsx` and `.js` → `.ts`

### Phase 2: Core Types (2-3 hours)

Create `src/types/index.ts`:
```typescript
// Game State
export type Screen = 'attract' | 'register' | 'processing' | 'spinning' | 'winner' | 'loading_session';
export type SessionKey = '7pm' | '8pm' | '9pm' | '10pm';

export interface Prize {
  id: string;
  name: string;
  color: string;
  text: string;
  emoji: string;
  weight: number;
}

export interface User {
  fullName: string;
  phone: string;
  receipt: string;
  idNumber: string;
}

export interface Lead {
  id: string;
  timestamp: string;
  session: string;
  fullName: string;
  phone: string;
  receipt: string;
  idNumber: string;
  prize: string;
}

export interface GameState {
  screen: Screen;
  activeSession: SessionKey | null;
  user: User | null;
  prize: Prize | null;
  leads: Lead[];
  sessionDecks: Record<SessionKey, Prize[]>;
}

// Reducer Action
export type GameAction =
  | { type: 'GO'; payload: Screen }
  | { type: 'SET_USER'; payload: User }
  | { type: 'START_SESSION'; payload: SessionKey }
  | { type: 'SUBMIT_INFO'; payload: User }
  | { type: 'SET_PRIZE'; payload: Prize }
  | { type: 'SAVE_AND_RESET' }
  | { type: 'REGISTER_LEAD' }
  | { type: 'CLEAR_LEADS' }
  | { type: 'RESET_ALL_DECKS' }
  | { type: 'IDLE_RESET' };

// API/Functions
export interface StorageResult {
  success: boolean;
  error?: string;
}
```

### Phase 3: Context & Reducer (2-3 hours)

Update `src/context/GameContext.tsx`:
```typescript
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { GameState, GameAction, User, Prize, Lead, SessionKey } from '../types';

// ... helpers with types

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'GO':
      return { ...state, screen: action.payload };
    // ... rest of reducer
    default:
      const _exhaustive: never = action;
      return _exhaustive;
  }
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  exportCSV: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, null, getInitialState);

  const exportCSV = (): void => {
    // ... export logic
  };

  return (
    <GameContext.Provider value={{ state, dispatch, exportCSV }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
}
```

### Phase 4: Components (4-5 hours)

Example: `src/components/RegisterScreen.tsx`:
```typescript
import { FC, useState, useRef } from 'react';
import type { User } from '../types';

interface RegisterScreenProps {
  onSubmit: (user: User) => void;
}

const RegisterScreen: FC<RegisterScreenProps> = ({ onSubmit }) => {
  const [form, setForm] = useState<User>({
    fullName: '',
    phone: '',
    receipt: '',
    idNumber: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof User, string>>>({});

  // ... rest of component
};

export default RegisterScreen;
```

### Phase 5: Hooks (1-2 hours)

Update `src/hooks/useIdleTimer.ts`:
```typescript
import { useEffect, useRef } from 'react';

export function useIdleTimer(onIdle: () => void, timeout: number = 60000): void {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const resetTimer = (): void => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(onIdle, timeout);
    };

    const events = ['mousedown', 'touchstart', 'keydown'] as const;
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [onIdle, timeout]);
}
```

### Phase 6: Testing (1-2 hours)

Add TypeScript test types:
```typescript
// src/types/test.ts
import type { GameState, GameAction } from './index';

export interface TestFixture {
  initialState: GameState;
  expectedState: GameState;
  action: GameAction;
}
```

## Estimated Effort

| Phase | Time | Priority |
|-------|------|----------|
| Setup | 1-2h | Critical |
| Types | 2-3h | Critical |
| Context | 2-3h | High |
| Components | 4-5h | High |
| Hooks | 1-2h | High |
| Testing | 1-2h | Medium |
| **Total** | **11-17h** | — |

## Rollout Strategy

1. **Branch**: Create `feature/typescript-migration` branch
2. **Gradual conversion**:
   - Week 1: Types + Context
   - Week 2: Components (1-2 per day)
   - Week 3: Hooks + Testing
3. **Testing**: Run full regression testing
4. **Merge**: PR review before merge
5. **Cleanup**: Remove `.eslintignore` entries for TS

## Common Issues & Solutions

### Issue: "Cannot find module"
```typescript
// Add paths to tsconfig.json
"compilerOptions": {
  "paths": {
    "@/*": ["src/*"]
  }
}
```

### Issue: "Never type exhaustive check failing"
```typescript
// Use exhaustive checking pattern
default:
  const _exhaustive: never = action;
  return _exhaustive;
```

### Issue: "React component not recognized"
```typescript
// Ensure proper import:
import React from 'react';
import { FC } from 'react';
```

## Benefits Post-Migration

1. **Faster Development**: IDE autocomplete and type checking
2. **Fewer Bugs**: Type errors caught early
3. **Better Documentation**: Types as self-docs
4. **Easier Refactoring**: Rename safely with confidence
5. **Team Onboarding**: New devs understand data structures immediately

## Rollback Plan

If migration causes issues:
```bash
git checkout main  # Return to JS version
npm install        # Reinstall deps
npm run dev        # Continue with JS
```

## References

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Vite + TypeScript](https://vitejs.dev/guide/features.html#typescript)
