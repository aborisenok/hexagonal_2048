import PropTypes from 'prop-types';
import {useRef, useState, useEffect } from "react";

import Grid from "./grid/Grid";
import Button from '../interface/button/Button';

import { getCellsData } from "../../../logic/api";
import {
  getGridSize,
  generateCells,
  getFilledCells,
  mergeCells,
  moveCells,
  isGameOver
} from "../../../logic/logic";

import { 
  addKeysControlsListener,
  addResizeListener } from "../../../logic/controls";
import { GAME_STATUS } from "../../../common/constants";

import "./game.css";
 
const Game = (props) => {
  const [cells, setCells] = useState(generateCells(props.radius, true));
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.PLAYING);
  const [canMove, _setCanMove] = useState(false);
  const [size, setSize] = useState(getGridSize(props.radius));

  const canMoveRef = useRef(canMove);

  const requestData = {
    serverUrl: props.serverUrl,
    port: props.port,
    radius: props.radius
  }

  const setCanMove = value => {
    canMoveRef.current = value;
    _setCanMove(value);
  };

  const getData = (data) => {
    setCanMove(false);

    getCellsData(requestData, data)
      .then((newCells) => {
        const resultCells = mergeCells(cells, newCells);
        setCells(() => {
          return resultCells;
        });
        setCanMove(true);
      }).catch(err => {
        setGameStatus(() => GAME_STATUS.SERVER_FAIL);
        setCanMove(false);
      })
  };

  const cellsChanged = () => {
    const isLoose = isGameOver(cells);

    if (isLoose) {
      setGameStatus(GAME_STATUS.GAME_OVER);
      setCanMove(false);
    }
  };

  const makeCellsMove = (axis) => {
    if (canMoveRef.current) {
      const { resultCells, isCellsChanged} = moveCells(
        cells,
        axis.mainAxis,
        axis.directionAxis
      );

      setCells(() => {
        return resultCells;
      });

      if (isCellsChanged) {
        const filledCells = getFilledCells(resultCells);
        getData(filledCells);
      }
    }
  };

  const recalculateGrigSize = () => {
    setSize(getGridSize(props.radius))
  }

  useEffect(() => {
    getData([]);
    addKeysControlsListener(makeCellsMove);
    addResizeListener(recalculateGrigSize);
    // eslint-disable-next-line
  }, []);

  addKeysControlsListener(makeCellsMove);

   useEffect(cellsChanged, [cells]);

  return (
    <div className="game">
      <Button layout='game_back_button' onClick={props.backToSettings}>Back</Button>
      <Grid width={size.width} height={size.height} radius={props.radius} cells={cells} />
      <div className="game_status">Game Status: <span data-status={gameStatus.key}>{gameStatus.text}</span></div>
      <Button hidden={gameStatus.key !== GAME_STATUS.GAME_OVER.key} onClick={props.restartGame}>Play Again</Button>
    </div>
  );
};

export default Game;

Game.propTypes = {
  radius: PropTypes.number.isRequired,
  port: PropTypes.number.isRequired,
  serverUrl: PropTypes.string.isRequired,
  backToSettings: PropTypes.func.isRequired,
  restartGame: PropTypes.func.isRequired
};
