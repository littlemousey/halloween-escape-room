import { useState, useEffect } from 'react';
import { Clock, Eye, Skull, Moon, Flame, Sparkles, BookOpen, Lock, Home, Droplets, Map } from 'lucide-react';

type GameState = 'intro' | 'playing' | 'won' | 'lost';
type Room = 'forest' | 'entrance' | 'potionRoom' | 'lair';  
type Item = 'map' | 'iron_key' | 'moonflower' | 'raven_feather' | 'crystal_shard' | 'shadow_moss' | 'escape_potion' | 'decoy_bottle' | 'decoy_herb';
type HintType = 'map' | 'riddle' | 'runes' | 'hidden' | 'spellbook' | 'potion' | 'final' | null;
type SearchLocation = 'dusty_shelf' | 'ancient_chest' | 'cobweb_corner' | 'stone_altar' | 'broken_mirror' | 'dark_nook';
type RuneType = 'moon' | 'star' | 'skull' | 'eye' | 'flame';

export default function WitchLairEscape() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [currentRoom, setCurrentRoom] = useState<Room>('forest');
  const [timeLeft, setTimeLeft] = useState(3600);
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
    runeMatching: false,
    hiddenObjects: false,
    spellbook: false,
    potion: false,
    finalEscape: false
  });
  const [hints, setHints] = useState(5);
  const [showHint, setShowHint] = useState<HintType>(null);
  const [riddleAnswer, setRiddleAnswer] = useState('');
  const [spellAnswer, setSpellAnswer] = useState('');
  const [potionIngredients, setPotionIngredients] = useState<Item[]>([]);
  const [finalCode, setFinalCode] = useState('');
  const [searchedLocations, setSearchedLocations] = useState<SearchLocation[]>([]);
  const [runePattern, setRunePattern] = useState<RuneType[]>([]);
  const [runeAttempts, setRuneAttempts] = useState(0);

  const correctRunePattern = ['moon', 'star', 'skull', 'eye', 'flame'];

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

  const addToInventory = (item: Item) => {
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
      setTimeout(() => setShowHint(null), 10000);
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

  const searchLocation = (location: SearchLocation) => {
    if (!searchedLocations.includes(location)) {
      setSearchedLocations([...searchedLocations, location]);
      
      const findings: Record<SearchLocation, { item: Item; message: string }> = {
        dusty_shelf: { item: 'decoy_bottle', message: 'You found a dusty bottle of unknown liquid. It might be useful...' },
        ancient_chest: { item: 'moonflower', message: 'Hidden inside is a rare Moonflower! Its petals glow softly.' },
        cobweb_corner: { item: 'decoy_herb', message: 'You found some dried herbs, but they look ordinary and withered.' },
        stone_altar: { item: 'raven_feather', message: 'A jet-black Raven Feather rests on the altar, pristine and powerful.' },
        broken_mirror: { item: 'crystal_shard', message: 'Among the shards, one piece glows with inner light - a Crystal Shard!' },
        dark_nook: { item: 'shadow_moss', message: 'Growing in the deepest shadow, you find the rare Shadow Moss.' }
      };

      const finding = findings[location];
      if (finding) {
        addToInventory(finding.item);
        alert(finding.message);
      }
    }
  };

  const addRuneToPattern = (rune: RuneType) => {
    if (runePattern.length < 5) {
      setRunePattern([...runePattern, rune]);
    }
  };

  const clearRunePattern = () => {
    setRunePattern([]);
  };

  const submitRunePattern = () => {
    if (JSON.stringify(runePattern) === JSON.stringify(correctRunePattern)) {
      setPuzzlesSolved({...puzzlesSolved, runeMatching: true});
      setRoomsUnlocked({...roomsUnlocked, lair: true});
      setRunePattern([]);
    } else {
      setRuneAttempts(runeAttempts + 1);
      alert('The runes pulse with rejection. Wrong pattern!');
      setRunePattern([]);
    }
  };

  const solveSpellbook = () => {
    if (spellAnswer.toLowerCase().trim() === 'midnight') {
      setPuzzlesSolved({...puzzlesSolved, spellbook: true});
      setSpellAnswer('');
    } else if (spellAnswer.trim() !== '') {
      alert('The ancient words reject your answer...');
      setSpellAnswer('');
    }
  };

  const checkHiddenObjects = () => {
    const requiredLocations: SearchLocation[] = ['ancient_chest', 'stone_altar', 'broken_mirror', 'dark_nook'];
    const foundAll = requiredLocations.every(loc => searchedLocations.includes(loc));
    if (foundAll && !puzzlesSolved.hiddenObjects) {
      setPuzzlesSolved({...puzzlesSolved, hiddenObjects: true});
      alert('You\'ve found all the hidden ingredients! The real items have been identified.');
    }
  };

  useEffect(() => {
    checkHiddenObjects();
  }, [searchedLocations]);

  const addPotionIngredient = (ingredient: Item) => {
    if (!potionIngredients.includes(ingredient) && inventory.includes(ingredient)) {
      setPotionIngredients([...potionIngredients, ingredient]);
      removeFromInventory(ingredient);
    }
  };

  const brewPotion = () => {
    const correctOrder = ['moonflower', 'raven_feather', 'crystal_shard', 'shadow_moss'];
    const hasDecoy = potionIngredients.some(ing => ing.includes('decoy'));
    
    if (hasDecoy) {
      alert('The cauldron bubbles violently and explodes! Wrong ingredients! The decoy items ruined the potion.');
      potionIngredients.forEach(ing => addToInventory(ing));
      setPotionIngredients([]);
    } else if (JSON.stringify(potionIngredients) === JSON.stringify(correctOrder)) {
      setPuzzlesSolved({...puzzlesSolved, potion: true});
      addToInventory('escape_potion');
      setPotionIngredients([]);
    } else {
      alert('The cauldron bubbles and spits! Wrong order or missing ingredients. Try again.');
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
      escape_potion: <Droplets className="w-5 h-5" />,
      decoy_bottle: <Droplets className="w-5 h-5" />,
      decoy_herb: <Flame className="w-5 h-5" />
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
      escape_potion: 'Escape Potion',
      decoy_bottle: 'Strange Bottle',
      decoy_herb: 'Dried Herbs'
    };
    return names[item] || item;
  };

  const getRuneIcon = (rune: RuneType) => {
    const icons: Record<RuneType, JSX.Element> = {
      moon: <Moon className="w-6 h-6" />,
      star: <Sparkles className="w-6 h-6" />,
      skull: <Skull className="w-6 h-6" />,
      eye: <Eye className="w-6 h-6" />,
      flame: <Flame className="w-6 h-6" />
    };
    return icons[rune];
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
              <li>• Search different locations to find hidden objects - some are decoys!</li>
              <li>• Solve riddles, match rune patterns, and decode spellbooks</li>
              <li>• Find the correct ingredients (avoid decoys) and brew them in the right order</li>
              <li>• Complete all puzzles to escape before midnight</li>
              <li>• Use 5 hints wisely if you get stuck</li>
            </ul>
          </div>
          <button 
            onClick={startGame}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            Enter the Lair
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
          {showHint === 'hidden' && "Search the ancient chest, stone altar, broken mirror, and dark nook for the REAL ingredients. Avoid the decoys!"}
          {showHint === 'runes' && "The pattern represents the witch's power: Moon (lunar magic), Star (celestial), Skull (death), Eye (vision), Flame (destruction)"}
          {showHint === 'spellbook' && "When is the witching hour? It's when the clock strikes twelve at night..."}
          {showHint === 'potion' && "The correct order is: Moonflower (lunar element first), Raven Feather (air), Crystal Shard (earth), Shadow Moss (shadow last). DO NOT use decoy items!"}
          {showHint === 'final' && "Look at your escape potion bottle carefully - there are faint numbers etched on the glass: 7-3-9-2"}
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
                <p className="text-green-300">✓ You found an ancient map! It reveals the entrance to the witch's lair. The path forward is now clear.</p>
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

            {/* Hidden Object Search */}
            <div className="bg-purple-900 bg-opacity-50 p-4 rounded-lg border border-purple-500">
              <h3 className="text-purple-300 font-bold mb-3">🔍 Search for Hidden Objects</h3>
              <p className="text-purple-200 mb-3 text-sm">
                The room is filled with various objects. Search carefully - some items are magical ingredients, while others are just decoys!
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => searchLocation('dusty_shelf')}
                  disabled={searchedLocations.includes('dusty_shelf')}
                  className={`px-3 py-2 rounded text-sm transition-colors ${
                    searchedLocations.includes('dusty_shelf')
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-purple-800 hover:bg-purple-700 text-purple-200'
                  }`}
                >
                  {searchedLocations.includes('dusty_shelf') ? '✓ Dusty Shelf' : 'Dusty Shelf'}
                </button>
                <button
                  onClick={() => searchLocation('ancient_chest')}
                  disabled={searchedLocations.includes('ancient_chest')}
                  className={`px-3 py-2 rounded text-sm transition-colors ${
                    searchedLocations.includes('ancient_chest')
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-purple-800 hover:bg-purple-700 text-purple-200'
                  }`}
                >
                  {searchedLocations.includes('ancient_chest') ? '✓ Ancient Chest' : 'Ancient Chest'}
                </button>
                <button
                  onClick={() => searchLocation('cobweb_corner')}
                  disabled={searchedLocations.includes('cobweb_corner')}
                  className={`px-3 py-2 rounded text-sm transition-colors ${
                    searchedLocations.includes('cobweb_corner')
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-purple-800 hover:bg-purple-700 text-purple-200'
                  }`}
                >
                  {searchedLocations.includes('cobweb_corner') ? '✓ Cobweb Corner' : 'Cobweb Corner'}
                </button>
                <button
                  onClick={() => searchLocation('stone_altar')}
                  disabled={searchedLocations.includes('stone_altar')}
                  className={`px-3 py-2 rounded text-sm transition-colors ${
                    searchedLocations.includes('stone_altar')
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-purple-800 hover:bg-purple-700 text-purple-200'
                  }`}
                >
                  {searchedLocations.includes('stone_altar') ? '✓ Stone Altar' : 'Stone Altar'}
                </button>
              </div>
              <button
                onClick={() => useHint('hidden')}
                className="mt-3 text-yellow-400 text-sm hover:text-yellow-300"
              >
                Hint ({hints} left)
              </button>
              {puzzlesSolved.hiddenObjects && (
                <p className="text-green-300 mt-3 text-sm">✓ You've identified all the real magical ingredients!</p>
              )}
            </div>
          </div>
        )}

        {/* POTION ROOM */}
        {currentRoom === 'potionRoom' && (
          <div className="bg-black bg-opacity-80 border-2 border-purple-600 rounded-lg p-6 shadow-lg">
            <h2 className="text-purple-300 font-bold text-2xl mb-4">🧪 Potion Room</h2>
            <p className="text-purple-200 mb-4">
              Shelves lined with bottles and jars surround you. A large cauldron sits in the center, still warm. Mysterious runes glow on the walls, and a dusty spellbook lies open on a table.
            </p>

            {/* More Hidden Objects */}
            <div className="bg-purple-900 bg-opacity-50 p-4 rounded-lg mb-4 border border-purple-500">
              <h3 className="text-purple-300 font-bold mb-3">🔍 Continue Searching</h3>
              <p className="text-purple-200 mb-3 text-sm">More ingredients might be hidden here...</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => searchLocation('broken_mirror')}
                  disabled={searchedLocations.includes('broken_mirror')}
                  className={`px-3 py-2 rounded text-sm transition-colors ${
                    searchedLocations.includes('broken_mirror')
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-purple-800 hover:bg-purple-700 text-purple-200'
                  }`}
                >
                  {searchedLocations.includes('broken_mirror') ? '✓ Broken Mirror' : 'Broken Mirror'}
                </button>
                <button
                  onClick={() => searchLocation('dark_nook')}
                  disabled={searchedLocations.includes('dark_nook')}
                  className={`px-3 py-2 rounded text-sm transition-colors ${
                    searchedLocations.includes('dark_nook')
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-purple-800 hover:bg-purple-700 text-purple-200'
                  }`}
                >
                  {searchedLocations.includes('dark_nook') ? '✓ Dark Nook' : 'Dark Nook'}
                </button>
              </div>
            </div>

            {/* Rune Matching Puzzle */}
            {!puzzlesSolved.runeMatching && (
              <div className="bg-purple-900 bg-opacity-50 p-4 rounded-lg mb-4 border border-purple-500">
                <h3 className="text-purple-300 font-bold mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Rune Pattern Lock
                </h3>
                <p className="text-purple-200 mb-3 text-sm">
                  A magical lock blocks the secret passage. Match the ancient rune pattern to unlock it. The pattern must be exact!
                </p>
                <div className="bg-black bg-opacity-50 p-3 rounded mb-3 border border-purple-700">
                  <p className="text-purple-300 text-xs mb-2">Current Pattern:</p>
                  <div className="flex gap-2 mb-3 min-h-[40px] flex-wrap">
                    {runePattern.length === 0 ? (
                      <span className="text-purple-400 italic text-sm">Empty - Select 5 runes in order</span>
                    ) : (
                      runePattern.map((rune, idx) => (
                        <div key={idx} className="bg-purple-800 p-2 rounded border border-purple-600 text-purple-200">
                          {getRuneIcon(rune)}
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <p className="text-purple-300 mb-2 text-sm">Available Runes (select 5):</p>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  <button
                    onClick={() => addRuneToPattern('moon')}
                    disabled={runePattern.length >= 5}
                    className="bg-purple-800 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-purple-200 p-3 rounded transition-colors flex items-center justify-center"
                  >
                    <Moon className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => addRuneToPattern('star')}
                    disabled={runePattern.length >= 5}
                    className="bg-purple-800 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-purple-200 p-3 rounded transition-colors flex items-center justify-center"
                  >
                    <Sparkles className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => addRuneToPattern('skull')}
                    disabled={runePattern.length >= 5}
                    className="bg-purple-800 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-purple-200 p-3 rounded transition-colors flex items-center justify-center"
                  >
                    <Skull className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => addRuneToPattern('eye')}
                    disabled={runePattern.length >= 5}
                    className="bg-purple-800 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-purple-200 p-3 rounded transition-colors flex items-center justify-center"
                  >
                    <Eye className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => addRuneToPattern('flame')}
                    disabled={runePattern.length >= 5}
                    className="bg-purple-800 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-purple-200 p-3 rounded transition-colors flex items-center justify-center"
                  >
                    <Flame className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={submitRunePattern}
                    disabled={runePattern.length !== 5}
                    className="bg-purple-700 hover:bg-purple-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded transition-colors"
                  >
                    Submit Pattern
                  </button>
                  <button
                    onClick={clearRunePattern}
                    className="bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => useHint('runes')}
                    className="text-yellow-400 text-sm hover:text-yellow-300 px-2"
                  >
                    Hint ({hints} left)
                  </button>
                </div>
                {runeAttempts > 0 && (
                  <p className="text-red-400 mt-2 text-sm">Attempts failed: {runeAttempts}</p>
                )}
              </div>
            )}

            {puzzlesSolved.runeMatching && (
              <div className="bg-green-900 bg-opacity-30 p-4 rounded-lg border border-green-600 mb-4">
                <p className="text-green-300">✓ The rune lock glows and clicks open! The Secret Lair is now accessible!</p>
              </div>
            )}

            {/* Spellbook Puzzle */}
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
                <p className="text-green-300">✓ The spellbook reveals an important clue for brewing the escape potion!</p>
              </div>
            )}

            {/* Potion Brewing */}
            {puzzlesSolved.hiddenObjects && puzzlesSolved.spellbook && !puzzlesSolved.potion && (
              <div className="bg-purple-900 bg-opacity-50 p-4 rounded-lg border border-purple-500">
                <h3 className="text-purple-300 font-bold mb-3 flex items-center gap-2">
                  <Droplets className="w-5 h-5" />
                  Brew the Escape Potion
                </h3>
                <p className="text-purple-200 mb-3 text-sm">
                  Add ingredients to the cauldron in the correct order. Use only the REAL ingredients (not decoys)! Order matters!
                </p>
                <div className="bg-black bg-opacity-50 p-3 rounded mb-3 border border-purple-700 min-h-[60px]">
                  <p className="text-purple-300 text-xs mb-2">Cauldron Contents:</p>
                  {potionIngredients.length === 0 ? (
                    <p className="text-purple-400 italic text-sm">Empty</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {potionIngredients.map((ing, idx) => (
                        <div key={idx} className="bg-purple-800 px-2 py-1 rounded text-purple-200 text-sm">
                          {idx + 1}. {getItemName(ing)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-purple-300 mb-2 text-sm">Available Ingredients:</p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {inventory.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => addPotionIngredient(item)}
                      className="bg-purple-800 hover:bg-purple-700 text-purple-200 px-3 py-2 rounded transition-colors text-sm flex items-center gap-2"
                    >
                      {getInventoryIcon(item)}
                      {getItemName(item)}
                    </button>
                  ))}
                </div>
                <button
                  onClick={brewPotion}
                  disabled={potionIngredients.length === 0}
                  className="bg-green-700 hover:bg-green-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded transition-colors mr-2"
                >
                  Brew Potion
                </button>
                <button
                  onClick={() => {
                    potionIngredients.forEach(ing => addToInventory(ing));
                    setPotionIngredients([]);
                  }}
                  className="bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Clear Cauldron
                </button>
                <button
                  onClick={() => useHint('potion')}
                  className="ml-2 text-yellow-400 text-sm hover:text-yellow-300"
                >
                  Hint ({hints} left)
                </button>
              </div>
            )}

            {puzzlesSolved.potion && (
              <div className="bg-green-900 bg-opacity-30 p-4 rounded-lg border border-green-600">
                <p className="text-green-300">✓ The potion bubbles and glows! You've created the Escape Potion! Look closely at the bottle...</p>
              </div>
            )}
          </div>
        )}

        {/* SECRET LAIR */}
        {currentRoom === 'lair' && (
          <div className="bg-black bg-opacity-80 border-2 border-purple-600 rounded-lg p-6 shadow-lg">
            <h2 className="text-purple-300 font-bold text-2xl mb-4">🔮 Secret Lair</h2>
            <p className="text-purple-200 mb-4">
              You've entered the witch's inner sanctum. A massive door inscribed with arcane symbols stands before you - the final barrier to freedom. The escape potion glows in your hand.
            </p>

            {!puzzlesSolved.potion && (
              <div className="bg-red-900 bg-opacity-30 p-4 rounded-lg border border-red-600">
                <p className="text-red-300">You need the Escape Potion to break the seal on this door. Return to the Potion Room and brew it!</p>
              </div>
            )}

            {puzzlesSolved.potion && !puzzlesSolved.finalEscape && (
              <div className="bg-purple-900 bg-opacity-50 p-4 rounded-lg border border-purple-500">
                <h3 className="text-purple-300 font-bold mb-3 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Final Magical Seal
                </h3>
                <p className="text-purple-200 mb-3 text-sm">
                  The door is sealed with powerful magic. You must enter a 4-digit code to break it. The escape potion bottle glows... perhaps it holds the answer?
                </p>
                <div className="flex gap-2 items-center mb-4">
                  <input
                    type="text"
                    value={finalCode}
                    onChange={(e) => setFinalCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="****"
                    className="bg-purple-950 text-purple-200 px-4 py-2 rounded border-2 border-purple-600 text-center text-2xl font-mono w-32"
                    maxLength={4}
                  />
                  <button
                    onClick={tryFinalEscape}
                    className="bg-green-700 hover:bg-green-600 text-white px-6 py-2 rounded transition-colors font-bold"
                  >
                    Break Seal
                  </button>
                </div>
                <button
                  onClick={() => useHint('final')}
                  className="text-yellow-400 text-sm hover:text-yellow-300"
                >
                  Hint ({hints} left)
                </button>
              </div>
            )}

            {puzzlesSolved.finalEscape && (
              <div className="bg-green-900 bg-opacity-50 p-4 rounded-lg border border-green-600">
                <p className="text-green-300 text-xl">✓ The seal shatters! The door swings open! You're FREE!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}