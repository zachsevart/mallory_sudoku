import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { usePips } from './hooks/usePips';
import { getCellValue, canPlaceDomino } from './utils/validator';
import { getPipPositions, getConstraintLabel } from './utils/renderer';
import { getRandomPuzzle } from './data/puzzles';
import type { Position, Region, Domino } from './types/pips';
import styles from './Pips.module.css';

function PipDots({ value }: { value: number }) {
  const positions = getPipPositions(value);
  return (
    <div className={styles.pipsGrid}>
      {Array.from({ length: 9 }, (_, i) => (
        <span
          key={i}
          className={`${styles.pipDot} ${positions.includes(i) ? styles.filled : ''}`}
        />
      ))}
    </div>
  );
}

function ConstraintBadge({ region }: { region: Region }) {
  const label = getConstraintLabel(region.constraint);
  if (!label) return null;
  return <span className={styles.constraintBadge}>{label}</span>;
}

/** Domino tile content (shared between tray tile and drag overlay) */
function DominoTileContent({ domino }: { domino: Domino }) {
  return (
    <>
      <div className={styles.dominoHalf}>
        <PipDots value={domino.values[0]} />
      </div>
      <div className={styles.dominoDivider} />
      <div className={styles.dominoHalf}>
        <PipDots value={domino.values[1]} />
      </div>
    </>
  );
}

/** Draggable domino in the tray */
function DraggableDomino({
  domino,
  isSelected,
  isDragActive,
  onSelect,
  onRotate,
}: {
  domino: Domino;
  isSelected: boolean;
  isDragActive: boolean;
  onSelect: () => void;
  onRotate: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: domino.id,
  });

  return (
    <button
      ref={setNodeRef}
      className={`${styles.dominoTile} ${domino.orientation === 'vertical' ? styles.vertical : ''} ${isSelected ? styles.selected : ''} ${isDragging ? styles.dragging : ''}`}
      onClick={onSelect}
      {...listeners}
      {...attributes}
    >
      {!isDragActive && <DominoTileContent domino={domino} />}
      {isDragActive && <DominoTileContent domino={domino} />}
      <button
        className={styles.rotateBtn}
        onClick={(e) => {
          e.stopPropagation();
          onRotate();
        }}
        aria-label="Rotate domino"
      >
        ↻
      </button>
    </button>
  );
}

/** Droppable board cell */
function DroppableCell({
  row,
  col,
  region,
  isFirstCell,
  isViolated,
  dominoClass,
  isOccupied,
  isClickDropTarget,
  isDragOverTarget,
  value,
  onClick,
  disabled,
}: {
  row: number;
  col: number;
  region: Region | undefined;
  isFirstCell: boolean;
  isViolated: boolean;
  dominoClass: string;
  isOccupied: boolean;
  isClickDropTarget: boolean;
  isDragOverTarget: boolean;
  value: number | null;
  onClick: () => void;
  disabled: boolean;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: `cell-${row}-${col}`,
    disabled,
  });

  const showDropHighlight = isClickDropTarget || (isOver && isDragOverTarget);

  return (
    <div
      ref={setNodeRef}
      className={`${styles.cell} ${isViolated ? styles.violated : ''} ${dominoClass} ${isOccupied ? styles.occupied : ''} ${showDropHighlight ? styles.dropTarget : ''}`}
      style={{ backgroundColor: region?.color || 'var(--bg-cell)' }}
      onClick={onClick}
    >
      {isFirstCell && region && <ConstraintBadge region={region} />}
      {value !== null && <PipDots value={value} />}
    </div>
  );
}

export function Pips() {
  const { state, dispatch, newGame } = usePips();
  const { puzzle, board, dominoes, placed, violations, isComplete, elapsedTime, isPaused } = state;

  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // Timer
  useEffect(() => {
    if (isPaused || isComplete) return;
    const interval = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearInterval(interval);
  }, [isPaused, isComplete, dispatch]);

  // Build region lookup
  const cellRegionMap = new Map<string, Region>();
  for (const region of puzzle.regions) {
    for (const [r, c] of region.cells) {
      cellRegionMap.set(`${r},${c}`, region);
    }
  }

  // Find first cell of each region (for constraint badge placement)
  const regionFirstCells = new Set<string>();
  for (const region of puzzle.regions) {
    if (region.cells.length > 0) {
      const [r, c] = region.cells[0];
      regionFirstCells.add(`${r},${c}`);
    }
  }

  const unplacedDominoes = dominoes.filter(d => !placed.has(d.id));

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Keyboard: undo/redo
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        dispatch({ type: 'REDO' });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [dispatch]);

  // Drag-and-drop handlers
  function handleDragStart(event: DragStartEvent) {
    setActiveDragId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveDragId(null);

    if (!over) return;

    const overId = over.id as string;
    if (!overId.startsWith('cell-')) return;

    const parts = overId.split('-');
    const row = parseInt(parts[1], 10);
    const col = parseInt(parts[2], 10);
    const dominoId = active.id as string;
    const domino = dominoes.find(d => d.id === dominoId);
    if (!domino) return;

    const position: Position = [row, col];
    if (canPlaceDomino(state, position, domino.orientation)) {
      dispatch({
        type: 'PLACE_DOMINO',
        dominoId,
        position,
        orientation: domino.orientation,
      });
    }
  }

  // Check if a cell can accept the currently dragged domino
  function isCellValidDragTarget(row: number, col: number, dragDomino: Domino | undefined): boolean {
    if (!dragDomino) return false;
    const cell = board[row][col];
    if (cell.inactive || cell.dominoId) return false;
    return canPlaceDomino(state, [row, col], dragDomino.orientation);
  }

  const activeDragDomino = activeDragId ? dominoes.find(d => d.id === activeDragId) : null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className={styles.app}>
        <header className={styles.header}>
          <Link to="/" className={styles.backButton} aria-label="Back to Game Hub">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </Link>
          <h1 className={styles.title}>Pips</h1>
          <div className={styles.headerRow}>
            <span className={styles.timer}>{formatTime(elapsedTime)}</span>
            <span className={styles.placedCount}>
              {placed.size}/{dominoes.length} placed
            </span>
          </div>
        </header>

        <main className={styles.main}>
          {/* Board */}
          <div
            className={styles.board}
            style={{
              gridTemplateColumns: `repeat(${puzzle.gridSize.cols}, var(--pips-cell-size))`,
              gridTemplateRows: `repeat(${puzzle.gridSize.rows}, var(--pips-cell-size))`,
            }}
          >
            {Array.from({ length: puzzle.gridSize.rows }, (_, row) =>
              Array.from({ length: puzzle.gridSize.cols }, (_, col) => {
                const key = `${row},${col}`;
                const region = cellRegionMap.get(key);
                const isFirstCell = regionFirstCells.has(key);
                const isViolated = region ? violations.has(region.id) : false;
                const pos: Position = [row, col];
                const value = getCellValue(state, pos);
                const cellOccupancy = board[row][col];

                if (cellOccupancy.inactive) {
                  return <div key={key} className={`${styles.cell} ${styles.inactive}`} />;
                }

                // Determine domino border connections
                const domino = cellOccupancy.dominoId
                  ? dominoes.find(d => d.id === cellOccupancy.dominoId)
                  : null;
                const placement = cellOccupancy.dominoId
                  ? placed.get(cellOccupancy.dominoId)
                  : null;

                // Check if this cell is a valid drop target for the selected (click) domino
                let isClickDropTarget = false;
                if (state.selectedDominoId && !cellOccupancy.dominoId) {
                  const selDom = dominoes.find(d => d.id === state.selectedDominoId);
                  if (selDom) {
                    isClickDropTarget = canPlaceDomino(state, pos, selDom.orientation);
                  }
                }

                let dominoClass = '';
                if (placement && domino) {
                  const isFirst = cellOccupancy.half === 'first';
                  if (placement.orientation === 'horizontal') {
                    dominoClass = isFirst ? styles.dominoLeft : styles.dominoRight;
                  } else {
                    dominoClass = isFirst ? styles.dominoTop : styles.dominoBottom;
                  }
                }

                const isDisabledDrop = !!cellOccupancy.dominoId || cellOccupancy.inactive;
                const isDragOverTarget = isCellValidDragTarget(row, col, activeDragDomino ?? undefined);

                return (
                  <DroppableCell
                    key={key}
                    row={row}
                    col={col}
                    region={region}
                    isFirstCell={isFirstCell}
                    isViolated={isViolated}
                    dominoClass={dominoClass}
                    isOccupied={!!cellOccupancy.dominoId}
                    isClickDropTarget={isClickDropTarget}
                    isDragOverTarget={isDragOverTarget}
                    value={value}
                    disabled={isDisabledDrop}
                    onClick={() => {
                      if (cellOccupancy.dominoId) {
                        dispatch({ type: 'REMOVE_DOMINO', dominoId: cellOccupancy.dominoId });
                      } else if (state.selectedDominoId) {
                        const selectedDomino = dominoes.find(d => d.id === state.selectedDominoId);
                        if (selectedDomino) {
                          dispatch({
                            type: 'PLACE_DOMINO',
                            dominoId: selectedDomino.id,
                            position: pos,
                            orientation: selectedDomino.orientation,
                          });
                        }
                      }
                    }}
                  />
                );
              })
            )}
          </div>

          {/* Controls */}
          <div className={styles.controls}>
            <button
              className={styles.actionBtn}
              onClick={() => dispatch({ type: 'UNDO' })}
              disabled={state.history.length === 0}
            >
              Undo
            </button>
            <button
              className={styles.actionBtn}
              onClick={() => dispatch({ type: 'REDO' })}
              disabled={state.future.length === 0}
            >
              Redo
            </button>
            <button
              className={styles.actionBtn}
              onClick={() => dispatch({ type: 'RESET' })}
            >
              Reset
            </button>
            <button
              className={`${styles.actionBtn} ${styles.newGameBtn}`}
              onClick={() => newGame(getRandomPuzzle())}
            >
              New Puzzle
            </button>
          </div>

          {/* Domino Tray */}
          <div className={styles.tray}>
            <h3 className={styles.trayTitle}>Dominoes</h3>
            <p className={styles.trayHint}>Drag dominoes onto the board, or click to select then click a cell</p>
            <div className={styles.trayGrid}>
              {unplacedDominoes.map(domino => (
                <DraggableDomino
                  key={domino.id}
                  domino={domino}
                  isSelected={state.selectedDominoId === domino.id}
                  isDragActive={activeDragId === domino.id}
                  onSelect={() => dispatch({
                    type: 'SELECT_DOMINO',
                    dominoId: state.selectedDominoId === domino.id ? null : domino.id,
                  })}
                  onRotate={() => dispatch({ type: 'ROTATE_DOMINO', dominoId: domino.id })}
                />
              ))}
            </div>
          </div>

          {/* Drag overlay — floating ghost while dragging */}
          <DragOverlay dropAnimation={null}>
            {activeDragDomino ? (
              <div className={`${styles.dominoTile} ${activeDragDomino.orientation === 'vertical' ? styles.vertical : ''} ${styles.dragOverlay}`}>
                <DominoTileContent domino={activeDragDomino} />
              </div>
            ) : null}
          </DragOverlay>

          {/* Win overlay */}
          {isComplete && (
            <div className={styles.winOverlay}>
              <div className={styles.winModal}>
                <span className={styles.winTrophy}>🎯</span>
                <h2>Puzzle Complete!</h2>
                <p className={styles.winTime}>{formatTime(elapsedTime)}</p>
                <button
                  className={styles.winButton}
                  onClick={() => newGame(getRandomPuzzle())}
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </DndContext>
  );
}
