import { createGlobalState } from 'react-hooks-global-state';

const { setGlobalState, useGlobalState } = createGlobalState({
  currUser: { role: 'DefaultUser' },
});

export const setUserState = (s) => {
  setGlobalState('currUser', s);
};

export { useGlobalState };
