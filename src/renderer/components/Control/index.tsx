import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { runSingleEpisode } from 'renderer/actions/engine/episode';
import { EnvProvider } from 'renderer/contexts/env';
import ReactJson from 'react-json-view';
import './control.global.scss';
import { STORE } from 'renderer/ipc/store/constants';
/**
 * Generic component. TODO probably split this up later
 */

const Control = () => {
  const [env, setEnv] = useState('');
  const [matchResult, setMatchResult] = useState<RunSingleEpsiodeRet>({
    final: 'abc',
  });
  const runMatch = () => {
    runSingleEpisode(env, [], 0)
      .then((res) => {
        console.log({ res });
        setMatchResult(res);
        return res;
      })
      .catch((err) => {
        console.error(err);
      });
  };
  // TODO move this out of this component
  const selectEnvironment = (e: React.FormEvent<HTMLInputElement>) => {
    // window.electron.store.get(STORE.ENV).then(console.log)
    // console.log({oldenv});
    const { files } = e.currentTarget;
    if (files && files.length > 0) {
      const newEnv = files[0].path;
      setEnv(newEnv);
      // window.electron.store.set(STORE.ENV, newEnv);
    }
  };
  return (
    <div className="Control">
      <EnvProvider value={{ setEnv, env }}>
        <Button variant="contained" component="label">
          Select Environment
          <input type="file" hidden onChange={selectEnvironment} />
        </Button>
        <Button onClick={runMatch} variant="contained" color="primary">
          Run Match
        </Button>
        {matchResult && (
          <div className="result-box">
            <ReactJson src={matchResult} />
          </div>
        )}
      </EnvProvider>
    </div>
  );
};
export default Control;
