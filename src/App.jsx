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
  Box
} from '@mantine/core';
import { IconWand } from '@tabler/icons-react';

function App() {
  // Single card state
  const [powerLevel, setPowerLevel] = useState('balanced');
  const [cardType, setCardType] = useState('Creature');
  const [cardName, setCardName] = useState('Lightning Drake');
  const [manaCost, setManaCost] = useState('{2}{R}');
  const [rarity, setRarity] = useState('Uncommon');
  const [subtype, setSubtype] = useState('Dragon');
  const [power, setPower] = useState('2');
  const [toughness, setToughness] = useState('1');
  const [rulesText, setRulesText] = useState('Flying\nWhenever Lightning Drake attacks, it deals 1 damage to any target.');
  const [flavorText, setFlavorText] = useState('Born from storm clouds and fury.');
  
  // Deck generator state
  const [deckTheme, setDeckTheme] = useState('Dragons & Fire');
  const [selectedColors, setSelectedColors] = useState(['red']);
  const [deckPowerLevel, setDeckPowerLevel] = useState('balanced');
  const [numCards, setNumCards] = useState('15');
  
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
  
  // Generate AI prompt string
  const generatePromptString = () => {
    const colorNames = selectedColors.map(c => colors.find(col => col.id === c)?.name.toLowerCase()).join(' ');
    return `${colorNames} ${deckTheme.toLowerCase()} ${deckPowerLevel}`;
  };
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCards, setGeneratedCards] = useState([]);

  const handleGenerateDeck = async () => {
    const promptString = generatePromptString();
    console.log('=== Deck Generation ===');
    console.log('Prompt for AI:', promptString);
    console.log('Number of cards:', numCards);
    console.log('======================');
    
    setIsGenerating(true);
    setGeneratedCards([]);
    
    try {
      // Replace 'YOUR_HF_API_TOKEN' with your actual Hugging Face API token
      const HF_API_TOKEN = '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';
      const response = await fetch(
        'https://api-inference.huggingface.co/models/minimaxir/magic-the-gathering',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${HF_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: promptString,
            parameters: {
              max_length: 30,
              num_return_sequences: parseInt(numCards),
              temperature: 0.8,
            }
          })
        }
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Generated cards:', result);
      setGeneratedCards(result);
      
    } catch (error) {
      console.error('Error generating cards:', error);
      alert('Failed to generate cards. Please check the console for details.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Box style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <Paper shadow="xs" p="xl" style={{ borderBottom: '1px solid #dee2e6' }}>
        <Container size="xl">
          <Title order={1} ta="center" mb="xs">
            Custom Card Generator
          </Title>
          <Text c="dimmed" ta="center">
            Create custom cards and decks for Magic: The Gathering and other tabletop games
          </Text>
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
                        value={power}
                        onChange={(e) => setPower(e.target.value)}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        label="Toughness"
                        value={toughness}
                        onChange={(e) => setToughness(e.target.value)}
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
                    border: '4px solid #000',
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
                      <Text fw={700} size="lg">{cardName}</Text>
                      <Text size="sm">{manaCost}</Text>
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
                      <Text size="sm" c="dimmed">Card Artwork</Text>
                    </Box>
                    
                    <Text 
                      size="sm" 
                      fw={600}
                      style={{ borderBottom: '2px solid #000', paddingBottom: '4px', marginBottom: '8px' }}
                    >
                      {cardType} — {subtype}
                    </Text>
                    
                    <Box mb="sm" style={{ minHeight: '48px' }}>
                      {rulesText.split('\n').map((line, i) => (
                        <Text key={i} size="xs" mb={4}>{line}</Text>
                      ))}
                    </Box>
                    
                    {flavorText && (
                      <Text size="xs" fs="italic" c="dimmed" mb="sm">
                        {flavorText}
                      </Text>
                    )}
                    
                    {cardType === 'Creature' && (
                      <Text ta="right" fw={700} size="lg">
                        {power}/{toughness}
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

              {/* Deck Theme */}
              <Select
                label="Deck Theme"
                value={deckTheme}
                onChange={setDeckTheme}
                data={[
                  'Dragons & Fire',
                  'Tribal Warriors',
                  'Spell Control',
                  'Token Swarm',
                  'Graveyard Recursion'
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
                            border: '2px solid #dee2e6'
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
              >
                {isGenerating ? 'Generating...' : `Generate ${numCards} Card ${selectedColors.map(c => colors.find(col => col.id === c)?.name).join('/')} Deck`}
              </Button>
              
              {/* Generated Cards Display */}
              {generatedCards.length > 0 && (
                <Paper withBorder p="md" mt="lg">
                  <Text fw={500} mb="md">Generated Cards:</Text>
                  <Stack gap="sm">
                    {generatedCards.map((card, index) => (
                      <Paper key={index} withBorder p="sm" style={{ backgroundColor: '#f8f9fa' }}>
                        <Text size="xs" style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                          {card.generated_text || JSON.stringify(card)}
                        </Text>
                      </Paper>
                    ))}
                  </Stack>
                </Paper>
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