/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import Viewer from 'renderer/components/section/viewer';
import Base from 'renderer/components/section/base';
import Control from 'renderer/components/Control';
import UserContext from 'renderer/contexts/user';
import { EnvProvider } from 'renderer/contexts/env';
import path from 'path-browserify';
import styles from './styles.scss';

const Illuminator = () => {
  const { userPreferences, setUserPreferences } = useContext(UserContext);
  const { env } = userPreferences;
  const setEnv = (filepath: string) => {
    setUserPreferences({ env: filepath });
  };
  const [html, setHtml] = useState('');
  const [iframe, setIframe] = useState<HTMLIFrameElement>();
  const runEpisode = async (
    envFile: string, // change to env name
    _agents: string[],
    _live: boolean,
    _seed?: number
  ) => {
    const envData = await window.electron.dimensions.makeEnv({ env: envFile });
    const htmlPath = path.join(path.dirname(envFile), envData.metaData.html);
    const html2 = (await window.electron.system.readFile(htmlPath)) as string;
    setHtml(html2);
    return {
      html: html2,
      postdata: 'agc',
    };
    // envData.id;
  };

  // temp storing epiode here
  // const [episodeId, setEpisodeId] = useState('');
  const createEpisode = async (envFile: string) => {
    const pyagent =
      '/Users/stonetao/Desktop/Coding/Projects/aicompetitions/dimensions/tests/envs/rps/agents/agent.py';
    const jsagent =
      '/Users/stonetao/Desktop/Coding/Projects/aicompetitions/dimensions/tests/envs/rps/agents/paper.js';
    const res = await window.electron.dimensions.createEpisode({
      env: envFile,
      agents: [pyagent, jsagent],
    });
    // setEpisodeId(res.episodeId);
    console.log('NEW EPISODE', res.episodeId, env);
    iframe!.contentWindow!.postMessage({ agentNames: res.agentNames });
    const htmlPath = path.join(path.dirname(envFile), res.metaData.html);
    const html2 = (await window.electron.system.readFile(htmlPath)) as string;
    setHtml(html2);
    return {
      html: html2,
      episodeId: res.episodeId,
      agentNames: res.agentNames,
    };
  };
  // todo move this to actions or smth
  const envStep = async (_episodeId: string) => {
    const res = await window.electron.dimensions.envStep({
      episodeId: _episodeId,
    });
    console.log('STEP', res.results);
    iframe!.contentWindow!.postMessage(
      res.results.outputs[res.results.outputs.length - 1].data
    );
    return {
      postdata: JSON.stringify(res.results),
    };
  };

  const updateRenderer = async (postdata: string) => {};
  useEffect(() => {
    // timer =
    // createEpisode(envId)
    //
    return () => {
      // clearInterval(timer);
    };
  }, []);
  // useEffect(() => {
  //   setEnvStep(envStepFnc);
  // }, [iframe]);
  return (
    <div className={styles.grid}>
      <EnvProvider
        value={{
          setEnv,
          env,
          runEpisode,
          createEpisode,
          envStep,
          iframe,
          setIframe,
          setHtml,
        }}
      >
        <Base hStart={0} hEnd={1} vStart={0} vEnd={2}>
          <Control />
        </Base>
        <Viewer html={html} hStart={1} hEnd={2} vStart={0} vEnd={2} />
        <Base hStart={2} hEnd={3} vStart={0} vEnd={1} />
        <Base hStart={2} hEnd={3} vStart={1} vEnd={2} />
        <Base hStart={0} hEnd={1} vStart={2} vEnd={3} />
        <Base hStart={1} hEnd={3} vStart={2} vEnd={3} />
      </EnvProvider>
    </div>
  );
};

export default Illuminator;
