import { useState, useEffect } from "react";
import queryString from 'query-string'

import Game from './game/Game';
import InterfacePanel from './interface/InterfacePanel';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { 
  validateQueryParams,
  setThemeToLocalStorage,
  getThemeFromLocalStorage
} from '../../logic/logic';
import { redirectTo, reloadPage } from '../../logic/navigation';

import { SERVER_URLS, LEVELS_RANGE, SERVER_PORTS, COLOR_THEME } from '../../common/constants'

import "./app.css";
import "./colors.css";

export const App = () => {
  const [port, setPort] = useState(SERVER_PORTS.REMOTE);
  const [serverUrl, setServerUrl] = useState(SERVER_URLS.REMOTE);
  const [level, setLevel] = useState(LEVELS_RANGE.MIN);
  const [isParams, setIsParams] = useState(false);
  const [appTheme, setAppTheme] = useState(getThemeFromLocalStorage());

  const onAppInit = () => {
    if (window.location.search) {
      const value = queryString.parse(window.location.search);
      const isValid = validateQueryParams(value.hostname, value.port, value.radius);

      if (isValid) {
        setPort(+value.port);
        setLevel(+value.radius);
        setServerUrl(value.hostname);
        setIsParams(true);
      } else {
        redirectTo(window.location.origin);
      }
    }
  }

  const onStartGame = () => {
    redirectTo(window.location.origin, {
      hostname: serverUrl.value,
      port: port.value,
      radius: level
    });
  };

  const backToSettings = () => {
    redirectTo(window.location.origin);
  }

  const toggleDarkMode = (checked) => {
    const colorTheme = checked ? COLOR_THEME.DARK : COLOR_THEME.LIGHT;
    setAppTheme(colorTheme);
    setThemeToLocalStorage(colorTheme)
  };
  
  useEffect(onAppInit, []);

  return (
    <div className={`app ${appTheme}_theme`}>
      {!isParams ? 
      <InterfacePanel
        port={port}
        level={level}
        serverUrl={serverUrl}
        onPortChange={setPort}
        onServerChange={setServerUrl}
        onLevelChange={setLevel}
        onStart={onStartGame} />
      : <Game 
          radius={level}
          port={port}
          serverUrl={serverUrl}
          backToSettings={backToSettings}
          restartGame={reloadPage} />
      }
      <div className="app_theme">
        <DarkModeSwitch
          checked={appTheme !== COLOR_THEME.LIGHT}
          onChange={toggleDarkMode}
          size={30}
          moonColor='white'
          sunColor='yellow'
        />
      </div>
    </div>
  );
}
