import React, { useState, useEffect } from 'react';
import { Clock, Eye, Skull, Moon, Flame, Sparkles, BookOpen, Lock, Home, Droplets, Map } from 'lucide-react';

type GameState = 'intro' | 'playing' | 'won' | 'lost';
type Room = 'forest' | 'entrance' | 'potionRoom' | 'lair';  
type Item = 'map' | 'iron_key' | 'moonflower' | 'raven_feather' | 'crystal_shard' | 'shadow_moss' | 'spell_scroll' | 'escape_potion';
type HintType = 'map' | 'riddle' | 'mirror' | 'spellbook' | 'potion' | 'final' | null;

export default function WitchLairEscape() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [currentRoom, setCurrentRoom] = useState<Room>('forest');
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [inventory, setInventory] = useState<Item[]>([]);
  const [roomsUnlocked, setRoomsUnlocked] = useState({
    forest: true,
    entrance: false,
    potionRoom: false,
    lair: false
  });
  const [puzzlesSolved, setPuzzlesSolved] = useState({
    map: false,
    doorRiddle: false,
    mirror: false,
    spellbook: false,
    potion: false,
    finalEscape: false
  });
  const [hints, setHints] = useState(5);
  const [showHint, setShowHint] = useState<HintType>(null);
  const [riddleAnswer, setRiddleAnswer] = useState('');
  const [spellAnswer, setSpellAnswer] = useState('');
  const [potionIngredients, setPotionIngredients] = useState<Item[]>([]);
  const [mirrorReflection, setMirrorReflection] = useState('');
  const [finalCode, setFinalCode] = useState('');

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('lost');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, timeLeft]);

  useEffect(() => {
    if (puzzlesSolved.finalEscape) {
      setGameState('won');
    }
  }, [puzzlesSolved]);

  const startGame = () => {
    setGameState('playing');
  };

  const addToInventory = (item:Item) => {
    if (!inventory.includes(item)) {
      setInventory([...inventory, item]);
    }
  };

  const removeFromInventory = (item: Item) => {
    setInventory(inventory.filter(i => i !== item));
  };

  const useHint = (puzzle: HintType) => {
    if (hints > 0) {
      setHints(hints - 1);
      setShowHint(puzzle);
      setTimeout(() => setShowHint(null), 8000);
    }
  };

  const solveMapPuzzle = () => {
    if (!puzzlesSolved.map) {
      setPuzzlesSolved({...puzzlesSolved, map: true});
      addToInventory('map');
      setRoomsUnlocked({...roomsUnlocked, entrance: true});
    }
  };

  const solveDoorRiddle = () => {
    if (riddleAnswer.toLowerCase().trim() === 'shadow') {
      setPuzzlesSolved({...puzzlesSolved, doorRiddle: true});
      setRoomsUnlocked({...roomsUnlocked, potionRoom: true});
      addToInventory('iron_key');
      setRiddleAnswer('');
    } else if (riddleAnswer.trim() !== '') {
      alert('Incorrect answer. The door remains sealed...');
      setRiddleAnswer('');
    }
  };

  const solveMirrorPuzzle = () => {
    const reversed = mirrorReflection.split('').reverse().join('');
    if (reversed.toLowerCase() === 'moonlight') {
      setPuzzlesSolved({...puzzlesSolved, mirror: true});
      addToInventory('crystal_shard');
      setMirrorReflection('');
    } else if (mirrorReflection.trim() !== '') {
      alert('The mirror shows nothing but confusion...');
      setMirrorReflection('');
    }
  };

  const solveSpellbook = () => {
    if (spellAnswer.toLowerCase().trim() === 'midnight') {
      setPuzzlesSolved({...puzzlesSolved, spellbook: true});
      setRoomsUnlocked({...roomsUnlocked, lair: true});
      addToInventory('spell_scroll');
      setSpellAnswer('');
    } else if (spellAnswer.trim() !== '') {
      alert('The ancient words reject your answer...');
      setSpellAnswer('');
    }
  };

  const addPotionIngredient = (ingredient: Item) => {
    if (!potionIngredients.includes(ingredient) && inventory.includes(ingredient)) {
      setPotionIngredients([...potionIngredients, ingredient]);
      removeFromInventory(ingredient);
    }
  };

  const brewPotion = () => {
    const correctOrder = ['moonflower', 'raven_feather', 'crystal_shard', 'shadow_moss'];
    if (JSON.stringify(potionIngredients) === JSON.stringify(correctOrder)) {
      setPuzzlesSolved({...puzzlesSolved, potion: true});
      addToInventory('escape_potion');
      setPotionIngredients([]);
    } else {
      alert('The cauldron bubbles and spits! Wrong combination. Try again.');
      potionIngredients.forEach(ing => addToInventory(ing));
      setPotionIngredients([]);
    }
  };

  const tryFinalEscape = () => {
    if (finalCode === '7392') {
      setPuzzlesSolved({...puzzlesSolved, finalEscape: true});
    } else if (finalCode.length === 4) {
      alert('The magical seal pulses with rejection...');
      setFinalCode('');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getInventoryIcon = (item: Item) => {
    const icons: Record<Item, JSX.Element> = {
      map: <Map className="w-5 h-5" />,
      iron_key: <Lock className="w-5 h-5" />,
      moonflower: <Sparkles className="w-5 h-5" />,
      raven_feather: <Eye className="w-5 h-5" />,
      crystal_shard: <Sparkles className="w-5 h-5" />,
      shadow_moss: <Skull className="w-5 h-5" />,
      spell_scroll: <BookOpen className="w-5 h-5" />,
      escape_potion: <Droplets className="w-5 h-5" />
    };
    return icons[item] || <Sparkles className="w-5 h-5" />;
  };

  const getItemName = (item: Item) => {
    const names: Record<Item, string> = {
      map: 'Ancient Map',
      iron_key: 'Iron Key',
      moonflower: 'Moonflower',
      raven_feather: 'Raven Feather',
      crystal_shard: 'Crystal Shard',
      shadow_moss: 'Shadow Moss',
      spell_scroll: 'Spell Scroll',
      escape_potion: 'Escape Potion'
    };
    return names[item] || item;
  };

  if (gameState === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-black flex items-center justify-center p-4">
        <div className="bg-black bg-opacity-80 border-4 border-purple-600 rounded-lg p-8 max-w-3xl shadow-2xl">
          <div className="text-center mb-6">
            <Moon className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h1 className="text-5xl font-bold text-purple-300 mb-2">The Witch's Lair</h1>
            <p className="text-purple-400 italic">A Halloween Escape Room Adventure</p>
          </div>
          <div className="text-purple-200 mb-6 leading-relaxed space-y-4">
            <p>
              Deep in the cursed forest, legends speak of a powerful witch who vanished centuries ago, leaving her lair hidden from mortal eyes. You've discovered an ancient map that supposedly leads to her dwelling.
            </p>
            <p>
              Driven by curiosity and a touch of foolishness, you venture into the woods on this moonless night. As you find the lair and step inside, the door slams shut behind you with an echoing boom. The witch's magic has trapped you!
            </p>
            <p className="text-yellow-400 font-semibold">
              You have 60 minutes to explore the lair, solve the witch's puzzles, brew an escape potion, and break free before she returns at midnight...
            </p>
          </div>
          <div className="bg-purple-900 bg-opacity-50 p-4 rounded-lg mb-6 border-2 border-purple-500">
            <h3 className="text-purple-300 font-bold mb-3 text-lg">How to Play:</h3>
            <ul className="text-purple-200 space-y-2 text-sm">
              <li>• Navigate through 4 rooms: Forest, Entrance Hall, Potion Room, and Secret Lair</li>
              <li>• Click on objects and areas to interact and search for items</li>
              <li>• Collect ingredients scattered across rooms</li>
              <li>• Solve riddles, mirror puzzles, and decode spellbooks</li>
              <li>• Brew the escape potion with ingredients in the correct order</li>
              <li>• Use 5 hints wisely if you get stuck</li>
            </ul>
          </div>
          <button 
            onClick={startGame}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <Skull className="w-6 h-6" />
            Enter the Lair
            <Skull className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'won') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 flex items-center justify-center p-4">
        <div className="bg-black bg-opacity-80 border-4 border-green-500 rounded-lg p-8 max-w-2xl text-center shadow-2xl">
          <Sparkles className="w-20 h-20 text-green-400 mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-green-400 mb-4">Escaped!</h1>
          <p className="text-green-200 text-xl mb-4">
            Time remaining: {formatTime(timeLeft)}
          </p>
          <p className="text-green-100 mb-6 leading-relaxed">
            With the escape potion in hand and the final seal broken, you rush through the opening door. The witch's magic dissipates as you step into the moonlight. Behind you, the lair fades into shadow, hidden once more. You've survived the witch's lair!
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'lost') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-950 via-red-900 to-black flex items-center justify-center p-4">
        <div className="bg-black bg-opacity-80 border-4 border-red-600 rounded-lg p-8 max-w-2xl text-center shadow-2xl">
          <Skull className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-red-400 mb-4">Midnight Has Come...</h1>
          <p className="text-red-200 mb-6 text-lg leading-relaxed">
            The clock strikes twelve. You hear footsteps approaching, followed by a cackling laugh that echoes through the lair. The witch has returned, and you are still trapped within her domain. Your fate is sealed...
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-black p-4">
      {/* Header */}
      <div className="bg-black bg-opacity-80 border-2 border-purple-600 rounded-lg p-4 mb-4 shadow-lg">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-purple-300">
              <Clock className="w-6 h-6" />
              <span className="text-2xl font-bold">{formatTime(timeLeft)}</span>
            </div>
            <div className="flex items-center gap-2 text-purple-300">
              <Eye className="w-6 h-6" />
              <span className="text-lg font-bold">Hints: {hints}</span>
            </div>
          </div>
          <div className="text-purple-300 text-lg font-bold">
            Current: {currentRoom === 'forest' ? '🌲 Forest' : currentRoom === 'entrance' ? '🏠 Entrance' : currentRoom === 'potionRoom' ? '🧪 Potion Room' : '🔮 Secret Lair'}
          </div>
        </div>
      </div>

      {/* Room Navigation */}
      <div className="bg-black bg-opacity-80 border-2 border-purple-600 rounded-lg p-4 mb-4 shadow-lg">
        <h3 className="text-purple-300 font-bold mb-3 flex items-center gap-2">
          <Home className="w-5 h-5" />
          Rooms:
        </h3>
        <div className="flex flex-wrap gap-2">
          {roomsUnlocked.forest && (
            <button
              onClick={() => setCurrentRoom('forest')}
              className={`px-4 py-2 rounded transition-colors ${currentRoom === 'forest' ? 'bg-purple-600 text-white' : 'bg-purple-900 text-purple-300 hover:bg-purple-800'}`}
            >
              🌲 Forest Path
            </button>
          )}
          {roomsUnlocked.entrance && (
            <button
              onClick={() => setCurrentRoom('entrance')}
              className={`px-4 py-2 rounded transition-colors ${currentRoom === 'entrance' ? 'bg-purple-600 text-white' : 'bg-purple-900 text-purple-300 hover:bg-purple-800'}`}
            >
              🏠 Entrance Hall
            </button>
          )}
          {roomsUnlocked.potionRoom && (
            <button
              onClick={() => setCurrentRoom('potionRoom')}
              className={`px-4 py-2 rounded transition-colors ${currentRoom === 'potionRoom' ? 'bg-purple-600 text-white' : 'bg-purple-900 text-purple-300 hover:bg-purple-800'}`}
            >
              🧪 Potion Room
            </button>
          )}
          {roomsUnlocked.lair && (
            <button
              onClick={() => setCurrentRoom('lair')}
              className={`px-4 py-2 rounded transition-colors ${currentRoom === 'lair' ? 'bg-purple-600 text-white' : 'bg-purple-900 text-purple-300 hover:bg-purple-800'}`}
            >
              🔮 Secret Lair
            </button>
          )}
        </div>
      </div>

      {/* Inventory */}
      <div className="bg-black bg-opacity-80 border-2 border-purple-600 rounded-lg p-4 mb-4 shadow-lg">
        <h3 className="text-purple-300 font-bold mb-2">Inventory:</h3>
        <div className="flex flex-wrap gap-2">
          {inventory.length === 0 ? (
            <span className="text-purple-400 italic">Empty</span>
          ) : (
            inventory.map((item, idx) => (
              <div key={idx} className="bg-purple-900 px-3 py-2 rounded border-2 border-purple-500 text-purple-200 flex items-center gap-2 text-sm">
                {getInventoryIcon(item)}
                {getItemName(item)}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Hint Display */}
      {showHint && (
        <div className="bg-yellow-900 border-2 border-yellow-600 rounded-lg p-4 mb-4 text-yellow-100 shadow-lg">
          <strong>💡 Hint: </strong>
          {showHint === 'map' && "Look for something ancient on the old tree stump. Maps are often found in hidden places..."}
          {showHint === 'riddle' && "Think about what follows you in light but disappears in darkness. It's cast by your body..."}
          {showHint === 'mirror' && "Mirrors show things in reverse. Try reading 'thgilnoom' backwards..."}
          {showHint === 'spellbook' && "When is the witching hour? It's when the clock strikes twelve at night..."}
          {showHint === 'potion' && "The correct order is: Moonflower (lunar element first), Raven Feather (air), Crystal Shard (earth), Shadow Moss (shadow last)"}
          {showHint === 'final' && "Look at your escape potion bottle - there are faint numbers etched on it: 7-3-9-2"}
        </div>
      )}

      {/* Room Content */}
      <div className="space-y-4">
        {/* FOREST PATH */}
        {currentRoom === 'forest' && (
          <div className="bg-black bg-opacity-80 border-2 border-purple-600 rounded-lg p-6 shadow-lg">
            <h2 className="text-purple-300 font-bold text-2xl mb-4">🌲 Dark Forest Path</h2>
            <p className="text-purple-200 mb-4">
              Twisted trees surround you, their branches forming ominous shapes against the dark sky. An old stone marker points deeper into the woods. You can make out the silhouette of a decrepit building ahead.
            </p>
            
            {!puzzlesSolved.map && (
              <div className="bg-purple-900 bg-opacity-50 p-4 rounded-lg mb-4 border border-purple-500">
                <h3 className="text-purple-300 font-bold mb-2 flex items-center gap-2">
                  <Map className="w-5 h-5" />
                  Old Tree Stump
                </h3>
                <p className="text-purple-200 mb-3 text-sm">A weathered stump covered in moss. Something seems hidden in a hollow beneath it...</p>
                <button
                  onClick={solveMapPuzzle}
                  className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors"
                >
                  Search the Stump
                </button>
                <button
                  onClick={() => useHint('map')}
                  className="ml-2 text-yellow-400 text-sm hover:text-yellow-300"
                >
                  Hint ({hints} left)
                </button>
              </div>
            )}

            {puzzlesSolved.map && (
              <div className="bg-green-900 bg-opacity-30 p-4 rounded-lg border border-green-600">
                <p className="text-green-300">✓ You found an ancient map! It reveals the entrance to the witch's lair is hidden in the stone marker. The path forward is now clear.</p>
              </div>
            )}

            {!inventory.includes('moonflower') && (
              <div className="bg-purple-900 bg-opacity-50 p-4 rounded-lg mt-4 border border-purple-500">
                <h3 className="text-purple-300 font-bold mb-2">Glowing Flowers</h3>
                <p className="text-purple-200 mb-3 text-sm">Strange flowers that glow with pale light grow near the path. They seem magical...</p>
                <button
                  onClick={() => addToInventory('moonflower')}
                  className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors"
                >
                  Collect Moonflower
                </button>
              </div>
            )}
          </div>
        )}

        {/* ENTRANCE HALL */}
        {currentRoom === 'entrance' && (
          <div className="bg-black bg-opacity-80 border-2 border-purple-600 rounded-lg p-6 shadow-lg">
            <h2 className="text-purple-300 font-bold text-2xl mb-4">🏠 Entrance Hall</h2>
            <p className="text-purple-200 mb-4">
              You've entered a dimly lit hall. Cobwebs drape from the ceiling, and ancient portraits line the walls. A large ornate door blocks the way deeper into the lair. Strange symbols glow faintly around its frame.
            </p>

            {!puzzlesSolved.doorRiddle && (
              <div className="bg-purple-900 bg-opacity-50 p-4 rounded-lg mb-4 border border-purple-500">
                <h3 className="text-purple-300 font-bold mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Enchanted Door Riddle
                </h3>
                <div className="bg-black bg-opacity-50 p-3 rounded mb-3 border border-purple-700">
                  <p className="text-purple-200 italic text-sm">
                    "I follow you by day, disappear in the night.<br/>
                    Born of your form when touched by the light.<br/>
                    I mimic your moves, yet make not a sound.<br/>
                    What am I that's cast upon the ground?"
                  </p>
                </div>
                <input
                  type="text"
                  value={riddleAnswer}
                  onChange={(e) => setRiddleAnswer(e.target.value)}
                  placeholder="Enter your answer..."
                  className="w-full bg-purple-950 text-purple-200 px-4 py-2 rounded border-2 border-purple-600 mb-2"
                />
                <button
                  onClick={solveDoorRiddle}
                  className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors"
                >
                  Submit Answer
                </button>
                <button
                  onClick={() => useHint('riddle')}
                  className="ml-2 text-yellow-400 text-sm hover:text-yellow-300"
                >
                  Hint ({hints} left)
                </button>
              </div>
            )}

            {puzzlesSolved.doorRiddle && (
              <div className="bg-green-900 bg-opacity-30 p-4 rounded-lg border border-green-600 mb-4">
                <p className="text-green-300">✓ The door unlocks with a satisfying click! The Potion Room is now accessible.</p>
              </div>
            )}

            {!inventory.includes('raven_feather') && (
              <div className="bg-purple-900 bg-opacity-50 p-4 rounded-lg border border-purple-500">
                <h3 className="text-purple-300 font-bold mb-2">Raven's Perch</h3>
                <p className="text-purple-200 mb-3 text-sm">A black raven sits motionless on a perch. A single feather has fallen beneath it...</p>
                <button
                  onClick={() => addToInventory('raven_feather')}
                  className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors"
                >
                  Take Raven Feather
                </button>
              </div>
            )}
          </div>
        )}

        {/* POTION ROOM */}
        {currentRoom === 'potionRoom' && (
          <div className="bg-black bg-opacity-80 border-2 border-purple-600 rounded-lg p-6 shadow-lg">
            <h2 className="text-purple-300 font-bold text-2xl mb-4">🧪 Potion Room</h2>
            <p className="text-purple-200 mb-4">
              Shelves lined with bottles and jars surround you. A large cauldron sits in the center, still warm. An ancient mirror hangs on the wall, and a dusty spellbook lies open on a table.
            </p>

            {!puzzlesSolved.mirror && (
              <div className="bg-purple-900 bg-opacity-50 p-4 rounded-lg mb-4 border border-purple-500">
                <h3 className="text-purple-300 font-bold mb-3 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Ancient Mirror Puzzle
                </h3>
                <p className="text-purple-200 mb-3 text-sm">
                  The mirror shows reversed writing: <span className="font-mono text-purple-400">"thgilnoom"</span>
                </p>
                <p className="text-purple-300 mb-2 text-sm">What word is reflected?</p>
                <input
                  type="text"
                  value={mirrorReflection}
                  onChange={(e) => setMirrorReflection(e.target.value)}
                  placeholder="Enter the word..."
                  className="w-full bg-purple-950 text-purple-200 px-4 py-2 rounded border-2 border-purple-600 mb-2"
                />
                <button
                  onClick={solveMirrorPuzzle}
                  className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors"
                >
                  Submit Answer
                </button>
                <button
                  onClick={() => useHint('mirror')}
                  className="ml-2 text-yellow-400 text-sm hover:text-yellow-300"
                >
                  Hint ({hints} left)
                </button>
              </div>
            )}

            {puzzlesSolved.mirror && !inventory.includes('crystal_shard') && (
              <div className="bg-green-900 bg-opacity-30 p-4 rounded-lg border border-green-600 mb-4">
                <p className="text-green-300">✓ The mirror shimmers and a crystal shard appears in your hand!</p>
              </div>
            )}

            {!puzzlesSolved.spellbook && (
              <div className="bg-purple-900 bg-opacity-50 p-4 rounded-lg mb-4 border border-purple-500">
                <h3 className="text-purple-300 font-bold mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Ancient Spellbook
                </h3>
                <div className="bg-black bg-opacity-50 p-3 rounded mb-3 border border-purple-700">
                  <p className="text-purple-200 text-sm mb-2">The spellbook's pages glow with an eerie light. One passage stands out:</p>
                  <p className="text-purple-300 italic text-sm">
                    "When the clock strikes twelve and day becomes night,<br/>
                    The witching hour brings forth my might.<br/>
                    Not morning, not evening, but in between I dwell,<br/>
                    At the stroke of this hour, I cast my spell."
                  </p>
                </div>
                <p className="text-purple-300 mb-2 text-sm">What hour does the spell speak of?</p>
                <input
                  type="text"
                  value={spellAnswer}
                  onChange={(e) => setSpellAnswer(e.target.value)}
                  placeholder="Enter the hour..."
                  className="w-full bg-purple-950 text-purple-200 px-4 py-2 rounded border-2 border-purple-600 mb-2"
                />
                <button
                  onClick={solveSpellbook}
                  className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors"
                >
                  Submit Answer
                </button>
                <button
                  onClick={() => useHint('spellbook')}
                  className="ml-2 text-yellow-400 text-sm hover:text-yellow-300"
                >
                  Hint ({hints} left)
                </button>
              </div>
            )}

            {puzzlesSolved.spellbook && (
              <div className="bg-green-900 bg-opacity-30 p-4 rounded-lg border border-green-600 mb-4">
                <p className="text-green-300">✓ The spellbook glows brightly! A hidden passage to the Secret Lair has opened!</p>
              </div>
            )}

            {!inventory.includes('shadow_moss') && (
              <div className="bg-purple-900 bg-opacity-50 p-4 rounded-lg mb-4 border border-purple-500">
                <h3 className="text-purple-300 font-bold mb-2">Dark Corner</h3>
                <p className="text-purple-200 mb-3 text-sm">Dark moss grows in the shadowy corner, clinging to the damp stones...</p>
                <button
                  onClick={() => addToInventory('shadow_moss')}
                  className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors"
                >
                  Collect Shadow Moss
                </button>
              </div>
            )}

            {puzzlesSolved.spellbook && !puzzlesSolved.potion && (
              <div className="bg-purple-900 bg-opacity-50 p-4 rounded-lg border border-purple-500">
                <h3 className="text-purple-300 font-bold mb-3 flex items-center gap-2">
                  <Flame className="w-5 h-5" />
                  Brewing Cauldron
                </h3>
                <p className="text-purple-200 mb-3 text-sm">
                  The cauldron bubbles mysteriously. You can add ingredients to brew an escape potion.
                </p>
                <div className="mb-3">
                  <p className="text-purple-300 text-sm mb-2">Current ingredients in cauldron:</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {potionIngredients.length === 0 ? (
                      <span className="text-purple-400 italic text-sm">None</span>
                    ) : (
                      potionIngredients.map((ing, idx) => (
                        <span key={idx} className="bg-purple-800 px-2 py-1 rounded text-purple-200 text-sm">
                          {getItemName(ing)}
                        </span>
                      ))
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(['moonflower', 'raven_feather', 'crystal_shard', 'shadow_moss'] as Item[]).map(ingredient => (
                    inventory.includes(ingredient) && (
                      <button
                        key={ingredient}
                        onClick={() => addPotionIngredient(ingredient)}
                        className="bg-purple-700 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Add {getItemName(ingredient)}
                      </button>
                    )
                  ))}
                </div>
                {potionIngredients.length > 0 && (
                  <button
                    onClick={brewPotion}
                    className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors mr-2"
                  >
                    Brew Potion
                  </button>
                )}
                <button
                  onClick={() => useHint('potion')}
                  className="text-yellow-400 text-sm hover:text-yellow-300"
                >
                  Hint ({hints} left)
                </button>
              </div>
            )}

            {puzzlesSolved.potion && (
              <div className="bg-green-900 bg-opacity-30 p-4 rounded-lg border border-green-600">
                <p className="text-green-300">✓ Perfect! The escape potion glows with magical energy. You can feel its power!</p>
              </div>
            )}
          </div>
        )}

        {/* SECRET LAIR */}
        {currentRoom === 'lair' && (
          <div className="bg-black bg-opacity-80 border-2 border-purple-600 rounded-lg p-6 shadow-lg">
            <h2 className="text-purple-300 font-bold text-2xl mb-4">🔮 Secret Lair</h2>
            <p className="text-purple-200 mb-4">
              The witch's innermost sanctum. Arcane symbols cover every surface, and a massive crystal orb dominates the center. The exit door bears a mystical seal that requires a code.
            </p>

            {!puzzlesSolved.finalEscape && inventory.includes('escape_potion') && (
              <div className="bg-purple-900 bg-opacity-50 p-4 rounded-lg border border-purple-500">
                <h3 className="text-purple-300 font-bold mb-3 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Mystical Exit Seal
                </h3>
                <p className="text-purple-200 mb-3 text-sm">
                  The door is sealed with powerful magic. Your escape potion glows near it, revealing faint numbers etched on the bottle...
                </p>
                <input
                  type="text"
                  value={finalCode}
                  onChange={(e) => setFinalCode(e.target.value)}
                  placeholder="Enter 4-digit code..."
                  maxLength={4}
                  className="w-full bg-purple-950 text-purple-200 px-4 py-2 rounded border-2 border-purple-600 mb-2"
                />
                <button
                  onClick={tryFinalEscape}
                  className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors"
                >
                  Break the Seal
                </button>
                <button
                  onClick={() => useHint('final')}
                  className="ml-2 text-yellow-400 text-sm hover:text-yellow-300"
                >
                  Hint ({hints} left)
                </button>
              </div>
            )}

            {!inventory.includes('escape_potion') && (
              <div className="bg-red-900 bg-opacity-30 p-4 rounded-lg border border-red-600">
                <p className="text-red-300">The exit seal remains dormant. You need the escape potion to activate it...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}