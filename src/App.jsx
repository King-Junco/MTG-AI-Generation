import React, { useState, useRef } from 'react';
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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import image1 from './pictures/Magic cards/1-1000/001.jpg';
import image2 from './pictures/Magic cards/1-1000/002.jpg';
import image3 from './pictures/Magic cards/1-1000/003.jpg';
import image4 from './pictures/Magic cards/1-1000/004.jpg';
import image5 from './pictures/Magic cards/1-1000/005.jpg';
import image6 from './pictures/Magic cards/1-1000/006.jpg';

const images = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
];
const randomIndex = Math.floor(Math.random() * images.length);
const randomElement = images[randomIndex];

// ========== CONFIGURATION ==========
const MAX_LENGTH = 100;
const TEMPERATURE = 0.8;
// ===================================

function formatCardFromBackend(cardObj) {
  return {
    name: cardObj.name || 'Unknown Card',
    manaCost: cardObj.manaCost || '',
    cardType: cardObj.type || 'Unknown',
    subtype: '',
    rulesText: cardObj.text || '',
    power: cardObj.power || '',
    toughness: cardObj.toughness || '',
    rawText: cardObj._raw || ''
  };
}

function parseCardText(cardText) {
  const original = cardText.trim();
  
  let name = 'Unknown Card';
  let manaCost = '';
  let cardType = 'Unknown';
  let subtype = '';
  let power = '';
  let toughness = '';
  let rulesText = '';
  
  const manaMatch = original.match(/\{[^\}]+\}/g);
  if (manaMatch) {
    manaCost = manaMatch.join('');
  }
  
  const ptMatch = original.match(/^(\d+|\*|X)(\d+|\*|X)(?!\/)/) || 
                  original.match(/(\d+|\*|X)\/(\d+|\*|X)/) ||
                  original.match(/^(\d+)(\d+)\s/);
  if (ptMatch) {
    power = ptMatch[1];
    toughness = ptMatch[2];
  }
  
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
  
  const namePattern = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*$/;
  const nameMatch = original.match(namePattern);
  if (nameMatch && nameMatch[1].length > 2 && nameMatch[1].length < 50) {
    name = nameMatch[1];
  }
  
  let cleanedText = original;
  
  if (manaCost) {
    cleanedText = cleanedText.replace(manaCost, '');
  }
  
  if (power && toughness) {
    cleanedText = cleanedText.replace(`${power}${toughness}`, '').replace(`${power}/${toughness}`, '');
  }
  
  if (creatureMatch) {
    cleanedText = cleanedText.replace(creatureMatch[0], '');
  } else {
    cleanedText = cleanedText.replace(/\b(Instant|Sorcery|Enchantment|Artifact|Land)\b/i, '');
  }
  
  if (name !== 'Unknown Card') {
    cleanedText = cleanedText.replace(name, '');
  }
  
  rulesText = cleanedText
    .replace(/\s+/g, ' ')
    .replace(/^\s*[\.\,\-]+\s*/, '')
    .trim();
  
  if (rulesText.length < 10) {
    rulesText = original;
  }
  
  return {
    name,
    manaCost,
    cardType,
    subtype,
    rulesText,
    power,
    toughness,
    rawText: original
  };
}

function MTGCard({ cardData, index }) {
  const randomIndex = Math.floor(Math.random() * images.length);
  const randomElement = images[randomIndex];
  let parsed;

  if (typeof cardData === 'object' && cardData !== null) {
    parsed = formatCardFromBackend(cardData);
  } else if (typeof cardData === 'string') {
    parsed = parseCardText(cardData);
  } else {
    console.error('Invalid card data:', cardData);
    parsed = {
      name: 'Error',
      manaCost: '',
      cardType: 'Unknown',
      subtype: '',
      rulesText: 'Invalid card data',
      power: '',
      toughness: '',
      rawText: ''
    }
  }
  
  let bgGradient = 'linear-gradient(to bottom, #e5e7eb, #f3f4f6)';
  if (parsed.manaCost.includes('{R}')) bgGradient = 'linear-gradient(to bottom, #fecaca, #fee2e2)';
  if (parsed.manaCost.includes('{U}')) bgGradient = 'linear-gradient(to bottom, #bfdbfe, #dbeafe)';
  if (parsed.manaCost.includes('{G}')) bgGradient = 'linear-gradient(to bottom, #bbf7d0, #dcfce7)';
  if (parsed.manaCost.includes('{W}')) bgGradient = 'linear-gradient(to bottom, #fef3c7, #fef9c3)';
  if (parsed.manaCost.includes('{B}')) bgGradient = 'linear-gradient(to bottom, #d1d5db, #e5e7eb)';
  
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
        <Group justify="space-between" mb="xs" align="flex-start">
          <Text fw={700} size="md" style={{ flex: 1, lineHeight: 1.2, color: '#000' }}>
            {parsed.name}
          </Text>
          <Text size="sm" fw={600} style={{ whiteSpace: 'nowrap', color: '#000' }}>
            {parsed.manaCost || '{?}'}
          </Text>
        </Group>

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
          <img src={randomElement} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Card art" />
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
          {parsed.cardType}
          {parsed.subtype && ` — ${parsed.subtype}`}
        </Text>
        
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
        
        {parsed.power && parsed.toughness && (
          <Box 
            style={{ 
              textAlign: 'right',
              background: 'rgba(0,0,0,0.05)',
              padding: '4px 8px',
              borderRadius: '4px',
              marginTop: '8px'
            }}
          >
            <Text fw={700} size="xl" style={{ color: '#000' }}>
              {parsed.power}/{parsed.toughness}
            </Text>
          </Box>
        )}
        
        <Badge size="xs" variant="light" mt="xs" color="dark">
          Card #{index + 1}
        </Badge>
      </Box>
    </Paper>
  );
}

function App() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  
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
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCards, setGeneratedCards] = useState([]);
  const [error, setError] = useState(null);

  // Refs for exporting
  const singleCardRef = useRef(null); // preview card ref
  const cardRefs = useRef([]); // refs to each generated-card wrapper

  // helper to clear refs when deck changes
  const resetCardRefs = (len) => {
    cardRefs.current = Array(len).fill().map((_, i) => cardRefs.current[i] || null);
  };

  const handleGenerateDeck = async () => {
    let prompt = deckTheme || 'creature';

    const manaCostStr = selectedColors.map(c => {
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
          mana_cost: manaCostStr,
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
        // prepare refs for new cards
        resetCardRefs(result.cards.length);
      } else {
        throw new Error('Invalid response from backend');
      }

    } catch (error) {
      console.error('Error generating cards:', error);
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // ========== PDF export helpers ==========

  // Export single preview card as one-page PDF
  const exportSingleCard = async () => {
    if (!singleCardRef.current) return;
    try {
      const canvas = await html2canvas(singleCardRef.current, { scale: 2, useCORS: true, allowTaint: true });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const margin = 12;
      const usableWidth = pdfWidth - (margin * 2);
      const imgProps = { width: canvas.width, height: canvas.height };
      const imgHeightMm = (canvas.height * usableWidth) / canvas.width;

      const x = margin;
      const y = (297 - imgHeightMm) / 2; // center vertically on A4 (297mm high)

      pdf.addImage(imgData, 'PNG', x, y, usableWidth, imgHeightMm);
      pdf.save('card-preview.pdf');
    } catch (err) {
      console.error('Error exporting single card:', err);
      setError('Failed to export single card.');
    }
  };

  // Export generated deck, 9 cards per A4 page (3x3)
  const exportDeckNinePerPage = async () => {
    if (!generatedCards || generatedCards.length === 0) return;

    try {
      const cards = cardRefs.current.slice(0, generatedCards.length);
      // dimensions in px to aim for consistent card size
      // We'll create an offscreen container per 9-card page, clone nodes into it, and render that container.
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const pdfHeight = 297;
      const marginMm = 8;
      const contentWidthMm = pdfWidth - marginMm * 2;
      const contentHeightMm = pdfHeight - marginMm * 2;

      // we'll render the whole 3x3 grid to fit content area
      // For canvas rendering we use px sizes; estimate target px width for each card
      // choose cardAspect from actual card DOM if available
      const chunkSize = 9;
      let pageIndex = 0;

      for (let i = 0; i < cards.length; i += chunkSize) {
        const chunk = cards.slice(i, i + chunkSize);

        // create offscreen container
        const off = document.createElement('div');
        off.style.position = 'fixed';
        off.style.left = '-10000px';
        off.style.top = '0';
        off.style.width = '900px'; // grid container width in px (3 cards of ~280 + gaps)
        off.style.height = '1200px';
        off.style.display = 'grid';
        off.style.gridTemplateColumns = 'repeat(3, 1fr)';
        off.style.gridAutoRows = 'auto';
        off.style.gap = '16px';
        off.style.padding = '16px';
        off.style.background = '#ffffff';
        off.style.boxSizing = 'border-box';

        // Copy up to 9 cards into offscreen container
        chunk.forEach((cardEl, idx) => {
          if (!cardEl) return;
          const clone = cardEl.cloneNode(true);
          // Ensure cloned card has consistent width to match grid
          clone.style.width = '280px';
          // center items inside grid cell
          const wrapper = document.createElement('div');
          wrapper.style.display = 'flex';
          wrapper.style.justifyContent = 'center';
          wrapper.style.alignItems = 'center';
          wrapper.appendChild(clone);
          off.appendChild(wrapper);
        });

        // fill remaining slots up to 9 with empty placeholders so layout is stable
        const placeholders = 9 - chunk.length;
        for (let p = 0; p < placeholders; p++) {
          const ph = document.createElement('div');
          ph.style.width = '280px';
          ph.style.height = '420px';
          off.appendChild(ph);
        }

        document.body.appendChild(off);

        // render offscreen container to canvas
        const canvas = await html2canvas(off, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#fff'
        });

        // remove the offscreen container
        document.body.removeChild(off);

        const imgData = canvas.toDataURL('image/png');

        // fit the canvas image into PDF page area (with margins)
        const usableWidth = contentWidthMm;
        const ratio = canvas.width / canvas.height;
        const imgWidthMm = usableWidth;
        const imgHeightMm = (canvas.height * imgWidthMm) / canvas.width;

        pdf.addImage(imgData, 'PNG', marginMm, marginMm, imgWidthMm, imgHeightMm);

        pageIndex++;
        if (i + chunkSize < cards.length) {
          pdf.addPage();
        }
      }

      pdf.save('generated-deck.pdf');
    } catch (err) {
      console.error('Error exporting deck:', err);
      setError('Failed to export deck.');
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
        {/* Single Card Designer - Full Width on Top */}
        <Paper shadow="sm" p="lg" radius="md" mb="xl">
          <Title order={2} mb="lg">Single Card Designer</Title>
          
          <Grid>
            {/* Left side - Form inputs */}
            <Grid.Col span={{ base: 12, lg: 7 }}>
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

                <TextInput
                  label="Card Name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  mb="md"
                />

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

                <Textarea
                  label="Rules Text"
                  value={rulesText}
                  onChange={(e) => setRulesText(e.target.value)}
                  rows={3}
                  mb="md"
                />

                <Textarea
                  label="Flavor Text (Optional)"
                  value={flavorText}
                  onChange={(e) => setFlavorText(e.target.value)}
                  rows={2}
                  mb="md"
                />

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
            </Grid.Col>

            {/* Right side - Card Preview */}
            <Grid.Col span={{ base: 12, lg: 5 }}>
              <Box style={{ display: 'flex', justifyContent: 'center', position: 'sticky', top: '20px' }}>
                <Paper
                  shadow="lg"
                  style={{
                    width: '260px',
                    border: '4px solid var(--mantine-color-default-border)',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}
                  ref={singleCardRef} // preview card DOM available for export
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
                      <Text ta="right" fw={700} size="lg" style={{ color: '#000' }}>
                        {power}/{toughness}
                      </Text>
                    )}
                  </Box>
                </Paper>
              </Box>

              {/* Export single preview button */}
              <Button fullWidth mt="md" onClick={exportSingleCard}>
                Export Preview Card (PDF)
              </Button>
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Deck Generator - Full Width Below */}
        <Paper shadow="sm" p="lg" radius="md" mb="xl">
          <Grid>
            {/* Left side - Deck Generator Controls */}
            <Grid.Col span={{ base: 12, lg: 7 }}>
              <Group mb="lg">
                <IconWand size={20} />
                <Title order={2}>Deck Generator</Title>
              </Group>

              {error && (
                <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" mb="md" onClose={() => setError(null)} withCloseButton>
                  {error}
                </Alert>
              )}

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
            </Grid.Col>

            {/* Right side - Preview/Info */}
            <Grid.Col span={{ base: 12, lg: 5 }}>
              <Paper withBorder p="md" style={{ position: 'sticky', top: '20px' }}>
                <Text fw={500} mb="sm">Generator Settings</Text>
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Selected Colors:</Text>
                    <Text size="sm" fw={500}>
                      {selectedColors.length > 0 
                        ? selectedColors.map(c => colors.find(col => col.id === c)?.symbol).join(', ')
                        : 'None'}
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Number of Cards:</Text>
                    <Text size="sm" fw={500}>{numCards}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Theme:</Text>
                    <Text size="sm" fw={500}>{deckTheme || 'No theme'}</Text>
                  </Group>
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>
          
          {/* Generated Cards Display - Full Width Below Controls */}
          {generatedCards.length > 0 && (
            <Box mt="xl">
              <Group position="apart" mb="md">
                <Text fw={500} mb="0" size="lg">Generated Cards ({generatedCards.length}):</Text>
                <Group>
                  <Button onClick={exportDeckNinePerPage} disabled={generatedCards.length === 0}>
                    Export Deck (9 per A4 page)
                  </Button>
                </Group>
              </Group>

              <Box style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '20px',
                justifyContent: 'flex-start'
              }}>
                {generatedCards.map((cardText, index) => {
                  // Provide a wrapper we can reference for exporting:
                  return (
                    <div
                      key={index}
                      ref={(el) => { cardRefs.current[index] = el; }}
                      style={{ width: '280px' }}
                    >
                      <MTGCard cardData={cardText} index={index} />
                    </div>
                  );
                })}
              </Box>
            </Box>
          )}
        </Paper>

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