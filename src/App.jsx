import { useState } from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Paper, 
  Select, 
  TextInput, 
  Textarea, 
  Button, 
  Group, 
  Stack,
  Grid,
  Checkbox,
  Badge,
  Box,
  Alert,
  useMantineColorScheme,
   ActionIcon,
} from '@mantine/core';
import { IconWand, IconAlertCircle, IconSun, IconMoon } from '@tabler/icons-react';
import image1 from './pictures/Magic cards/1-1000/001.jpg';
import image2 from './pictures/Magic cards/1-1000/002.jpg';
import image3 from './pictures/Magic cards/1-1000/003.jpg';
import image4 from './pictures/Magic cards/1-1000/004.jpg';
import image5 from './pictures/Magic cards/1-1000/005.jpg';
import image6 from './pictures/Magic cards/1-1000/006.jpg';
import image7 from './pictures/Magic cards/1-1000/007.jpg';
import image8 from './pictures/Magic cards/1-1000/008.jpg';
import image9 from './pictures/Magic cards/1-1000/009.jpg';
import image10 from './pictures/Magic cards/1-1000/010.jpg';
import image11 from './pictures/Magic cards/1-1000/011.jpg';
import image12 from './pictures/Magic cards/1-1000/012.jpg';
import image14 from './pictures/Magic cards/1-1000/014.jpg';
import image16 from './pictures/Magic cards/1-1000/016.jpg';
import image17 from './pictures/Magic cards/1-1000/017.jpg';
import image19 from './pictures/Magic cards/1-1000/019.jpg';
import image20 from './pictures/Magic cards/1-1000/020.jpg';
import image21 from './pictures/Magic cards/1-1000/021.jpg';
import image22 from './pictures/Magic cards/1-1000/022.jpg';
import image23 from './pictures/Magic cards/1-1000/023.jpg';
import image24 from './pictures/Magic cards/1-1000/024.jpg';
import image26 from './pictures/Magic cards/1-1000/026.jpg';
import image27 from './pictures/Magic cards/1-1000/027.jpg';
import image28 from './pictures/Magic cards/1-1000/028.jpg';
import image29 from './pictures/Magic cards/1-1000/029.jpg';
import image30 from './pictures/Magic cards/1-1000/030.jpg';
import image31 from './pictures/Magic cards/1-1000/031.jpg';
import image32 from './pictures/Magic cards/1-1000/032.jpg';
import image33 from './pictures/Magic cards/1-1000/033.jpg';
import image34 from './pictures/Magic cards/1-1000/034.jpg';
import image35 from './pictures/Magic cards/1-1000/035.jpg';
import image36 from './pictures/Magic cards/1-1000/036.jpg';
import image37 from './pictures/Magic cards/1-1000/037.jpg';
import image38 from './pictures/Magic cards/1-1000/038.jpg';
import image39 from './pictures/Magic cards/1-1000/039.jpg';
import image40 from './pictures/Magic cards/1-1000/040.jpg';
import image41 from './pictures/Magic cards/1-1000/041.jpg';
import image42 from './pictures/Magic cards/1-1000/042.jpg';
import image43 from './pictures/Magic cards/1-1000/043.jpg';
import image44 from './pictures/Magic cards/1-1000/044.jpg';
import image45 from './pictures/Magic cards/1-1000/045.jpg';
import image47 from './pictures/Magic cards/1-1000/047.jpg';
import image48 from './pictures/Magic cards/1-1000/048.jpg';
import image49 from './pictures/Magic cards/1-1000/049.jpg';
import image50 from './pictures/Magic cards/1-1000/050.jpg';
import image51 from './pictures/Magic cards/1-1000/051.jpg';

const images = [
  image1,  image2,  image3,  image4,  image5,  image6,  image7,  image8, 
  image9,  image10, image11, image12, image14, image16, image17, image19, 
  image20, image21, image22, image23, image24, image26, image27, image28,
  image29, image30, image31, image32, image33, image34, image35, image36,
  image37, image38, image39, image40, image41, image42, image43, image44,
  image45, image47, image48, image49, image50, image51,

]
const randomIndex = Math.floor(Math.random() * images.length);
const randomIndex1 = Math.floor(Math.random() * 10);
const randomElement = images[randomIndex];


//render(<Button />, document.getElementById('container'));


//useEffect(() => changeImage(), [])

{/*export function RandomWelcomePicture() {
  const [currentImageIndex, setCurrentImageIndex] = useState(Math.floor(Math.random() * images.length))
  const changeImage = () => {
    const randomNumber = Math.floor(Math.random() * images.length);
    setCurrentImageIndex(randomNumber);
  }
  useEffect(() => changeImage(), [])

  return (
    <Image
        source={images[currentImageIndex]}
        style={styles.imageStyle}
    />
  )
}*/}

// ========== CONFIGURATION ==========
const MAX_LENGTH = 100;  // Controls how much text the AI generates per card
const TEMPERATURE = 0.8;  // Controls randomness (0.0 = deterministic, 1.0 = creative)
// ===================================


function formatCardFromBackend(cardObj) {
  // Backend already gives us structured data
  return {
    name: cardObj.name || 'Unknown Card',
    manaCost: cardObj.manaCost || '',
    cardType: cardObj.type || 'Unknown',
    subtype: '', // Extract if needed
    rulesText: cardObj.text || '',
    power: cardObj.power || '',
    toughness: cardObj.toughness || '',
    rawText: cardObj._raw || ''
  };
}

// Parse MTG card text into structured data
function parseCardText(cardText) {
  const original = cardText.trim();
  const randomPower = Math.floor(Math.random() * 10);
  const randomToughness = Math.floor(Math.random() * 10);
  // Initialize defaults
  let name = 'Unknown Card';
  let manaCost = '';
  let cardType = 'Unknown';
  let subtype = '';
  let power = '';
  let toughness = '';
  let rulesText = '';
  
  // Extract mana cost (pattern: {X}{Y})
  const manaMatch = original.match(/\{[^\}]+\}/g);
  if (manaMatch) {
    manaCost = manaMatch.join('');
  }
  
  // Extract power/toughness (patterns: 32, 3/2, or at start of text)
  const ptMatch = original.match(/^(\d+|\*|X)(\d+|\*|X)(?!\/)/) || // 32 format
                  original.match(/(\d+|\*|X)\/(\d+|\*|X)/) ||        // 3/2 format
                  original.match(/^(\d+)(\d+)\s/);                    // Start of line
  //if (ptMatch) {
  power = randomPower;
  toughness = randomToughness;
  //}
  
  // Extract card type (Creature, Instant, Sorcery, etc.)
  const creatureMatch = original.match(/Creature\s*[—-]\s*([A-Za-z\s]+?)(?=\s*[\.\n]|$)/i);
  if (creatureMatch) {
    cardType = 'Creature';
    subtype = creatureMatch[1].trim();
  } else if (original.match(/\bInstant\b/i)) {
    cardType = 'Instant';
  } else if (original.match(/\bSorcery\b/i)) {
    cardType = 'Sorcery';
  } else if (original.match(/\bEnchantment\b/i)) {
    cardType = 'Enchantment';
  } else if (original.match(/\bArtifact\b/i)) {
    cardType = 'Artifact';
  } else if (original.match(/\bLand\b/i)) {
    cardType = 'Land';
  }
  
  // Extract card name (usually capitalized words at the end, or after card type)
  // Try to find name after creature type or at the end
  const namePattern = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*$/;
  const nameMatch = original.match(namePattern);
  if (nameMatch && nameMatch[1].length > 2 && nameMatch[1].length < 50) {
    name = nameMatch[1];
  }
  
  // Build rules text - remove mana cost, power/toughness, type line, and name
  let cleanedText = original;
  
  // Remove mana cost
  if (manaCost) {
    cleanedText = cleanedText.replace(manaCost, '');
  }
  
  // Remove power/toughness
  if (power && toughness) {
    cleanedText = cleanedText.replace(`${power}${toughness}`, '').replace(`${power}/${toughness}`, '');
  }
  
  // Remove card type line
  if (creatureMatch) {
    cleanedText = cleanedText.replace(creatureMatch[0], '');
  } else {
    cleanedText = cleanedText.replace(/\b(Instant|Sorcery|Enchantment|Artifact|Land)\b/i, '');
  }
  
  // Remove name
  if (name !== 'Unknown Card') {
    cleanedText = cleanedText.replace(name, '');
  }
  
  // Clean up the rules text
  rulesText = cleanedText
    .replace(/\s+/g, ' ')  // Normalize whitespace
    .replace(/^\s*[\.\,\-]+\s*/, '')  // Remove leading punctuation
    .trim();
  
  // If rules text is too short or empty, use original
  if (rulesText.length < 10) {
    rulesText = original;
  }
  
  return {
    name,
    manaCost,
    cardType,
    subtype,
    rulesText,
    randomPower,
    randomToughness,
    rawText: original
  };
}

// Card display component
function MTGCard({ cardData, index }) {
  
  const randomPower1 = Math.floor(Math.random() * 10);
  const randomToughness1 = Math.floor(Math.random() * 10);
  //const parsed = parseCardText(cardData);
  const randomIndex = Math.floor(Math.random() * images.length);
  const randomElement = images[randomIndex];
  let parsed;

  if (typeof cardData === 'object' && cardData !== null) {
    parsed = formatCardFromBackend(cardData);
  }

  else if (typeof cardData === 'string') {
    parsed = parseCardText(cardData);
  }

  else {
    console.error('Invalid card data:', cardData);
    parsed = {
      name: 'Error',
      manaCost: '',
      cardType: 'Unknown',
      subtype: '',
      rulesText: 'Invalid card data',
      power: randomPower1,
      toughness: randomToughness1,
      rawText: ''
    }
  }
  
  // Determine color based on mana cost
  let bgGradient = 'linear-gradient(to bottom, #e5e7eb, #f3f4f6)'; // Colorless/Artifact
  if (parsed.manaCost.includes('{R}')) bgGradient = 'linear-gradient(to bottom, #fecaca, #fee2e2)'; // Red
  if (parsed.manaCost.includes('{U}')) bgGradient = 'linear-gradient(to bottom, #bfdbfe, #dbeafe)'; // Blue
  if (parsed.manaCost.includes('{G}')) bgGradient = 'linear-gradient(to bottom, #bbf7d0, #dcfce7)'; // Green
  if (parsed.manaCost.includes('{W}')) bgGradient = 'linear-gradient(to bottom, #fef3c7, #fef9c3)'; // White
  if (parsed.manaCost.includes('{B}')) bgGradient = 'linear-gradient(to bottom, #d1d5db, #e5e7eb)'; // Black
  
  return (
    <Paper
      shadow="lg"
      style={{
        width: '280px',
        border: '4px solid var(--mantine-color-default-border)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    >
      <Box p="md" style={{ background: bgGradient }}>
        {/* Header: Name and Mana Cost */}
        <Group justify="space-between" mb="xs" align="flex-start">
          <Text fw={700} size="md" style={{ flex: 1, lineHeight: 1.2, color: '#000' }}>
            {parsed.name}
          </Text>
          <Text size="sm" fw={600} style={{ whiteSpace: 'nowrap', color: '#000' }}>
            {parsed.manaCost || '{?}'}
          </Text>
        </Group>

        
        {/* Image placeholder */}
        <Box
          mb="sm"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(0,0,0,0.1))',
            height: '140px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(0,0,0,0.1)'
          }}
        >
        {/*  <img src={ require('./src/pictures/Magic cards/1-1000/001.jpg')} /> 
          import image1 from './pictures/Magic cards/1-1000/001.jpg';*/}
          
          <img src={randomElement} /> 
        </Box>
        
        {/* Type Line */}
        <Text 
          size="sm" 
          fw={600}
          style={{ 
            borderBottom: '2px solid #000', 
            paddingBottom: '4px', 
            marginBottom: '8px',
            color: '#000'
          }}
        >
          {parsed.cardType}
          {parsed.subtype && ` — ${parsed.subtype}`}
        </Text>
        
        {/* Rules Text */}
        <Box mb="sm" style={{ minHeight: '60px' }}>
          {parsed.rulesText ? (
            parsed.rulesText.split('\n').map((line, i) => (
              <Text key={i} size="xs" mb={3} style={{ color: '#000' }}>
                {line}
              </Text>
            ))
          ) : (
            <Text size="xs" c="dimmed" fs="italic" style={{ color: '#666' }}>
              No rules text
            </Text>
          )}
        </Box>
        
        {/* Power/Toughness */}
        
        {randomPower1 && randomToughness1 && (
          <Box 
            style={{ 
              textAlign: 'right',
              background: 'rgba(0,0,0,0.05)',
              padding: '4px 8px',
              borderRadius: '4px',
              marginTop: '8px'
            }}
          >
            <Text fw={700} size="xl">
              {randomPower1}/{randomToughness1}
            </Text>
          </Box>
        )}
        
        {/* Card number badge */}
        <Badge size="xs" variant="light" mt="xs">
          Card #{index + 1}
        </Badge>
      </Box>
    </Paper>
  );
}

function App() {
  // Single card state
  
  const randomPower2 = Math.floor(Math.random() * 10);
  const randomToughness2 = Math.floor(Math.random() * 10);

  const [powerLevel, setPowerLevel] = useState('balanced');
  const [cardType, setCardType] = useState('Creature');
  const [cardName, setCardName] = useState('Lightning Drake');
  const [manaCost, setManaCost] = useState('{2}{R}');
  const [rarity, setRarity] = useState('Uncommon');
  const [subtype, setSubtype] = useState('Dragon');
  const [rulesText, setRulesText] = useState('Flying\nWhenever Lightning Drake attacks, it deals 1 damage to any target.');
  const [flavorText, setFlavorText] = useState('Born from storm clouds and fury.');
  
  // Deck generator state
  const [deckTheme, setDeckTheme] = useState('dragons');
  const [selectedColors, setSelectedColors] = useState(['red']);
  const [deckPowerLevel, setDeckPowerLevel] = useState('');
  const [numCards, setNumCards] = useState('5');
  
  const colors = [
    { id: 'red', name: 'Red', symbol: 'R', description: 'Aggression, fire, lightning', color: '#EF4444' },
    { id: 'blue', name: 'Blue', symbol: 'U', description: 'Control, water, knowledge', color: '#3B82F6' },
    { id: 'white', name: 'White', symbol: 'W', description: 'Order, light, protection', color: '#E5E7EB' },
    { id: 'black', name: 'Black', symbol: 'B', description: 'Power, death, sacrifice', color: '#1F2937' },
    { id: 'green', name: 'Green', symbol: 'G', description: 'Nature, growth, creatures', color: '#10B981' }
  ];
  
  const toggleColor = (colorId) => {
    if (selectedColors.includes(colorId)) {
      setSelectedColors(selectedColors.filter(c => c !== colorId));
    } else {
      setSelectedColors([...selectedColors, colorId]);
    }
  };
  
  // Generate AI prompt string - simpler format
  const generatePromptString = () => {
    // Just use color symbols, simpler for the AI
    const colorSymbols = selectedColors.map(c => {
      const color = colors.find(col => col.id === c);
      return `{${color.symbol}}`;
    }).join('');
    
    return colorSymbols || '{C}'; // {C} for colorless if no colors selected
  };
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCards, setGeneratedCards] = useState([]);
  const [error, setError] = useState(null);

  const handleGenerateDeck = async () => {
    let prompt = deckTheme || 'creature';

    const manaCost = selectedColors.map(c => {
      const color = colors.find(col => col.id === c);
      return `{${color.symbol}}`;
    }).join('');

    console.log('=== Deck Generation ===');
    console.log('Prompt for AI:', prompt);
    console.log('Number of cards:', numCards);
    console.log('======================');

    setIsGenerating(true);
    setGeneratedCards([]);
    setError(null);

    try {
      const BACKEND_URL = 'http://localhost:5000';

      const response = await fetch(`${BACKEND_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          mana_cost: manaCost,
          num_cards: parseInt(numCards),
          temperature: TEMPERATURE,
          max_length: MAX_LENGTH
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Backend error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Backend response:', result);

      if (result.success && result.cards) {
        setGeneratedCards(result.cards);
      }
      else {
        throw new Error('Invalid response from backend');
      }

    }
    catch (error) {
      console.error('Error generating cards:', error);
      setError(error.message);
    }
    finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Box style={{ minHeight: '100vh' }}>
      {/* Header */}
      <Paper shadow="xs" p="xl" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
        <Container size="xl">
          <Group justify="space-between" align="center">
            <Box style={{ flex: 1 }}>
              <Title order={1} ta="center" mb="xs">
                Custom Card Generator
              </Title>
              <Text c="dimmed" ta="center">
                Create custom cards and decks for Magic: The Gathering and other tabletop games
              </Text>
            </Box>
            <ActionIcon
              variant="default"
              onClick={toggleColorScheme}
              size="lg"
              aria-label="Toggle color scheme"
            >
              {colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
            </ActionIcon>
          </Group>
        </Container>
      </Paper>

      {/* Main Content */}
      <Container size="xl" py="xl">
        <Grid>
          {/* Left Column - Single Card Designer */}
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Paper shadow="sm" p="lg" radius="md">
              <Title order={2} mb="lg">Single Card Designer</Title>
              
              {/* Power Level */}
              <Select
                label="Power Level"
                value={powerLevel}
                onChange={setPowerLevel}
                data={[
                  { value: 'balanced', label: 'Balanced - Standard power level cards' },
                  { value: 'casual', label: 'Casual - Fun, less competitive' },
                  { value: 'competitive', label: 'Competitive - Tournament level' }
                ]}
                mb="lg"
              />

              {/* Card Designer Section */}
              <Paper withBorder p="md" mb="md">
                <Text fw={500} mb="md">Card Designer</Text>
                
                {/* Card Type Buttons */}
                <Group mb="md">
                  {['Creature', 'Instant', 'Artifact'].map((type) => (
                    <Button
                      key={type}
                      variant={cardType === type ? 'filled' : 'default'}
                      color={cardType === type ? 'dark' : 'gray'}
                      onClick={() => setCardType(type)}
                      size="sm"
                    >
                      {type}
                    </Button>
                  ))}
                </Group>

                {/* Card Name */}
                <TextInput
                  label="Card Name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  mb="md"
                />

                {/* Mana Cost and Rarity */}
                <Grid mb="md">
                  <Grid.Col span={6}>
                    <TextInput
                      label="Mana Cost"
                      value={manaCost}
                      onChange={(e) => setManaCost(e.target.value)}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Select
                      label="Rarity"
                      value={rarity}
                      onChange={setRarity}
                      data={['Common', 'Uncommon', 'Rare', 'Mythic']}
                    />
                  </Grid.Col>
                </Grid>

                {/* Card Type and Subtype */}
                <Grid mb="md">
                  <Grid.Col span={6}>
                    <Select
                      label="Card Type"
                      value={cardType}
                      onChange={setCardType}
                      data={['Creature', 'Instant', 'Sorcery', 'Artifact', 'Enchantment']}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Subtype"
                      value={subtype}
                      onChange={(e) => setSubtype(e.target.value)}
                    />
                  </Grid.Col>
                </Grid>

                {/* Power and Toughness */}
                {cardType === 'Creature' && (
                  <Grid mb="md">
                    <Grid.Col span={6}>
                      <TextInput
                        label="Power"
                        value={randomPower2}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        label="Toughness"
                        value={randomToughness2}
                      />
                    </Grid.Col>
                  </Grid>
                )}

                {/* Rules Text */}
                <Textarea
                  label="Rules Text"
                  value={rulesText}
                  onChange={(e) => setRulesText(e.target.value)}
                  rows={3}
                  mb="md"
                />

                {/* Flavor Text */}
                <Textarea
                  label="Flavor Text (Optional)"
                  value={flavorText}
                  onChange={(e) => setFlavorText(e.target.value)}
                  rows={2}
                  mb="md"
                />

                {/* Card Artwork */}
                <Stack gap="xs">
                  <Text size="sm" fw={500}>Card Artwork</Text>
                  <Button variant="default" fullWidth style={{ height: '60px' }}>
                    Generate Artwork
                  </Button>
                  <Text size="xs" c="dimmed">
                    Generates artwork based on card name and type
                  </Text>
                </Stack>
              </Paper>

              {/* Card Preview */}
              <Box style={{ display: 'flex', justifyContent: 'center' }}>
                <Paper
                  shadow="lg"
                  style={{
                    width: '260px',
                    border: '4px solid var(--mantine-color-default-border)',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    p="md"
                    style={{
                      background: 'linear-gradient(to bottom, #fed7aa, #fef3c7)'
                    }}
                  >
                    <Group justify="space-between" mb="sm">
                      <Text fw={700} size="lg" style={{ color: '#000' }}>{cardName}</Text>
                      <Text size="sm" style={{ color: '#000' }}>{manaCost}</Text>
                    </Group>
                    
                    {/* Image placeholder */}
                    <Box
                      mb="sm"
                      style={{
                        background: 'linear-gradient(to bottom right, #fed7aa, #fde68a)',
                        height: '160px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Text size="sm" c="dimmed" style={{ color: '#666' }}>Card Artwork</Text>
                    </Box>
                    
                    <Text 
                      size="sm" 
                      fw={600}
                      style={{ 
                        borderBottom: '2px solid #000', 
                        paddingBottom: '4px', 
                        marginBottom: '8px',
                        color: '#000'
                      }}
                    >
                      {cardType} — {subtype}
                    </Text>
                    
                    <Box mb="sm" style={{ minHeight: '48px' }}>
                      {rulesText.split('\n').map((line, i) => (
                        <Text key={i} size="xs" mb={4} style={{ color: '#000' }}>{line}</Text>
                      ))}
                    </Box>
                    
                    {flavorText && (
                      <Text size="xs" fs="italic" mb="sm" style={{ color: '#666' }}>
                        {flavorText}
                      </Text>
                    )}
                    
                    {cardType === 'Creature' && (
                      <Text ta="right" fw={700} size="lg">
                        {randomPower2}/{randomToughness2}
                      </Text>
                    )}
                  </Box>
                </Paper>
              </Box>
            </Paper>
          </Grid.Col>

          {/* Right Column - Deck Generator */}
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Paper shadow="sm" p="lg" radius="md">
              <Group mb="lg">
                <IconWand size={20} />
                <Title order={2}>Deck Generator</Title>
              </Group>

              {/* Error Alert */}
              {error && (
                <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" mb="md" onClose={() => setError(null)} withCloseButton>
                  {error}
                </Alert>
              )}

              {/* Deck Theme */}
              <Select
                label="Deck Theme (Optional)"
                value={deckTheme}
                onChange={setDeckTheme}
                placeholder="No theme"
                clearable
                data={[
                  'dragons',
                  'warriors',
                  'wizards',
                  'zombies',
                  'elves',
                  'angels',
                  'demons'
                ]}
                mb="lg"
              />

              {/* Deck Colors */}
              <Stack gap="sm" mb="lg">
                <Group justify="space-between">
                  <Text fw={500} size="sm">
                    Deck Colors ({selectedColors.length} selected)
                  </Text>
                  <Group gap="xs">
                    <Button 
                      size="xs" 
                      variant="subtle"
                      onClick={() => setSelectedColors(colors.map(c => c.id))}
                    >
                      All
                    </Button>
                    <Button 
                      size="xs" 
                      variant="subtle"
                      onClick={() => setSelectedColors([])}
                    >
                      None
                    </Button>
                  </Group>
                </Group>
                
                <Stack gap="xs">
                  {colors.map((color) => (
                    <Paper 
                      key={color.id}
                      withBorder 
                      p="sm"
                      style={{ cursor: 'pointer' }}
                      onClick={() => toggleColor(color.id)}
                    >
                      <Group>
                        <Checkbox
                          checked={selectedColors.includes(color.id)}
                          onChange={() => toggleColor(color.id)}
                        />
                        <Box
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: color.color,
                            border: '2px solid var(--mantine-color-default-border)'
                          }}
                        />
                        <Box style={{ flex: 1 }}>
                          <Group gap="xs">
                            <Text size="sm" fw={500}>{color.name}</Text>
                            <Badge size="xs" variant="light">{color.symbol}</Badge>
                          </Group>
                          <Text size="xs" c="dimmed">{color.description}</Text>
                        </Box>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              </Stack>

              {/* Power Level */}
              <Select
                label="Power Level"
                value={deckPowerLevel}
                onChange={setDeckPowerLevel}
                data={[
                  { value: 'balanced', label: 'Balanced - Standard power level cards' },
                  { value: 'casual', label: 'Casual - Fun, less competitive' },
                  { value: 'competitive', label: 'Competitive - Tournament level' }
                ]}
                mb="lg"
              />

              {/* Number of Cards */}
              <TextInput
                label="Number of Cards"
                type="number"
                value={numCards}
                onChange={(e) => setNumCards(e.target.value)}
                min={1}
                max={60}
                mb="xs"
              />
              <Text size="xs" c="dimmed" mb="lg">
                Rarity distribution: ~50% Common, ~30% Uncommon, ~15% Rare, ~5% Mythic
              </Text>

              {/* Generate Button */}
              <Button 
                fullWidth 
                color="dark" 
                size="md"
                style={{ height: '48px' }}
                onClick={handleGenerateDeck}
                loading={isGenerating}
                disabled={selectedColors.length === 0}
              >
                {isGenerating ? 'Generating...' : `Generate ${numCards} Card ${selectedColors.map(c => colors.find(col => col.id === c)?.name).join('/')} Deck`}
              </Button>
              
              {selectedColors.length === 0 && (
                <Text size="xs" c="red" mt="xs">
                  Please select at least one color
                </Text>
              )}
              
              {/* Generated Cards Display - Card Format */}
              {generatedCards.length > 0 && (
                <Box mt="lg">
                  <Text fw={500} mb="md">Generated Cards ({generatedCards.length}):</Text>
                  <Box style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '16px',
                    justifyContent: 'center'
                  }}>
                    {generatedCards.map((cardText, index) => (
                      <MTGCard key={index} cardData={cardText} index={index} />
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Tips Section */}
        <Paper shadow="sm" p="lg" radius="md" mt="xl">
          <Title order={2} mb="lg">Tips for Creating Cards:</Title>
          
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Text fw={500} mb="xs">Mana Cost Format:</Text>
              <Text size="sm" c="dimmed">
                Use curly braces: {'{2}{R}{G}'} for 2 generic, red, and green mana
              </Text>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Text fw={500} mb="xs">Rules Text:</Text>
              <Text size="sm" c="dimmed">
                Use line breaks to separate abilities. Keywords like "Flying" and "Haste" are single words.
              </Text>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Text fw={500} mb="xs">Power/Toughness:</Text>
              <Text size="sm" c="dimmed">
                Only applies to creatures. Use numbers, asterisks (*), or variables like "X".
              </Text>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Text fw={500} mb="xs">Deck Themes:</Text>
              <Text size="sm" c="dimmed">
                Each theme generates cards with consistent mechanics and flavor appropriate to the theme.
              </Text>
            </Grid.Col>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

export default App;