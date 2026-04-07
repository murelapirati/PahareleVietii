import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trash2, Dices, RotateCcw, Plus } from 'lucide-react';
import './index.css';

const CUPS_COLORS = [
  '#10b981' // Emerald Green
];

export default function App() {
  const [choices, setChoices] = useState([]);
  const [cups, setCups] = useState([]); // [{id, choice, color}]
  const [inputValue, setInputValue] = useState('');
  const [gameState, setGameState] = useState('setup'); // setup, shuffling, ready, revealed
  const [revealedCupId, setRevealedCupId] = useState(null);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const newChoice = inputValue.trim();
    if (choices.includes(newChoice)) {
      alert("Choice already exists!");
      return;
    }
    setChoices([...choices, newChoice]);
    setInputValue('');

    const cupColor = CUPS_COLORS[cups.length % CUPS_COLORS.length];
    setCups([...cups, { id: crypto.randomUUID(), choice: newChoice, color: cupColor }]);
  };

  const removeChoice = (idToRemove) => {
    const cupToRemove = cups.find(c => c.id === idToRemove);
    setChoices(choices.filter(c => c !== cupToRemove.choice));
    setCups(cups.filter(c => c.id !== idToRemove));
  };

  const startShuffle = async () => {
    if (cups.length < 2) return;
    setGameState('shuffling');
    setRevealedCupId(null);

    // How many times to swap
    const shuffleSteps = 8;
    const delay = 400; // ms

    let currentCups = [...cups];

    for (let i = 0; i < shuffleSteps; i++) {
      await new Promise(r => setTimeout(r, delay));

      // Randomly shuffle array
      currentCups = [...currentCups].sort(() => Math.random() - 0.5);
      setCups(currentCups);
    }

    await new Promise(r => setTimeout(r, delay));
    setGameState('ready');
  };

  const handleCupClick = (id) => {
    if (gameState !== 'ready') return;
    setRevealedCupId(id);
    setGameState('revealed');
  };

  const resetGame = () => {
    setGameState('setup');
    setRevealedCupId(null);
  };

  return (
    <div className="glass-container">
      <header>
        <h1 className="title-gradient">Decide-te fah batrane</h1>
        <p className="subtitle">Destinul iti apartine (sau poate ca nu)</p>
      </header>

      {/* Inputs Section */}
      {gameState === 'setup' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="input-section"
        >
          <form onSubmit={handleAdd} className="input-group">
            <input
              type="text"
              className="input-field"
              placeholder="E.g. Pizza, Burger, Sushi..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              maxLength={20}
            />
            <button type="submit" className="btn-primary">
              <Plus size={20} />
              Add
            </button>
          </form>

          <div className="choices-container" style={{ marginTop: '1.5rem' }}>
            <AnimatePresence>
              {cups.map((cup) => (
                <motion.div
                  key={cup.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="choice-chip"
                >
                  <div className="choice-color-dot" style={{ backgroundColor: cup.color, color: cup.color }}></div>
                  <span>{cup.choice}</span>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => removeChoice(cup.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Status Banner */}
      <div className="status-message">
        {gameState === 'setup' && cups.length < 2 && "Add at least 2 choices to play!"}
        {gameState === 'shuffling' && "Shuffling..."}
        {gameState === 'ready' && "Pick a cup!"}
        {gameState === 'revealed' && (
          <span className="success-message">
            <Sparkles size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />
            You got: {cups.find(c => c.id === revealedCupId)?.choice}
          </span>
        )}
      </div>

      {/* Game Table / Cups Layout */}
      {(cups.length > 0) && (
        <div className="game-table">
          <AnimatePresence>
            {cups.map((cup) => {
              const isRevealed = revealedCupId === cup.id;

              return (
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="cup-wrapper"
                  key={cup.id}
                >
                  {/* The text sits underneath, hidden unless this cup is revealed */}
                  <motion.div
                    className="choice-hidden-text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isRevealed ? 1 : 0 }}
                    transition={{ duration: 0.3, delay: isRevealed ? 0.2 : 0 }}
                  >
                    {cup.choice}
                  </motion.div>

                  <motion.div
                    className="cup-container"
                    whileHover={gameState === 'ready' ? { scale: 1.05, y: -5 } : {}}
                    whileTap={gameState === 'ready' ? { scale: 0.95 } : {}}
                    onClick={() => handleCupClick(cup.id)}
                    animate={
                      isRevealed
                        ? { y: -120, x: -10, rotate: -15, opacity: 0.95, scale: 1.1 }
                        : { y: 0, x: 0, rotate: 0, opacity: 1, scale: 1 }
                    }
                  >
                    {/* Visual Cup Elements */}
                    <div className="cup-body" style={{ backgroundColor: cup.color }}>
                      <div className="cup-top"></div>
                      <div className="cup-shine"></div>
                      <div className="cup-rim"></div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
        {(gameState === 'setup' || gameState === 'revealed') && cups.length >= 2 && (
          <button
            className="btn-primary"
            onClick={startShuffle}
          >
            <Dices size={20} />
            {gameState === 'revealed' ? 'Shuffle Again' : 'Shuffle & Play'}
          </button>
        )}

        {gameState === 'revealed' && (
          <button
            className="btn-primary"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', boxShadow: 'none' }}
            onClick={resetGame}
          >
            <RotateCcw size={20} />
            Edit Choices
          </button>
        )}
      </div>

    </div>
  );
}
