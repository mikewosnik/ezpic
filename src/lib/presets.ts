export interface Preset {
  id: string;
  name: string;
  category: 'sports' | 'wildlife';
  caption: string;
  stylePrompt: string;
  seed: string; // picsum seed
}

const SUFFIX =
  ' Apply this exact photographic editing style to the provided photo. Preserve all subjects, composition, and content exactly. The output must be strictly photorealistic — not artistic, painted, illustrated, or stylized in any way.';

export const SPORTS_PRESETS: Preset[] = [
  {
    id: 'high-contrast-sports',
    name: 'High Contrast Sports',
    category: 'sports',
    caption: 'Punchy blacks, broadcast-ready saturation',
    seed: 'hcsports',
    stylePrompt: `High contrast sports photography. Deep crushed blacks, bright punchy highlights, boosted saturation especially in warm tones (reds, oranges), cool-neutral shadows, high clarity and sharpness on subjects, strong S-curve tone curve, cinematic sports broadcast energy.${SUFFIX}`,
  },
  {
    id: 'dramatic-action',
    name: 'Dramatic Action',
    category: 'sports',
    caption: 'Dark and intense — built for motion',
    seed: 'draction',
    stylePrompt: `Dramatic action sports style. Heavy vignette at edges, desaturated background letting subject colors pop, dark moody shadows with golden-orange midtones, high micro-contrast on subject detail, cinematic widescreen feel, slight lift in shadow tones.${SUFFIX}`,
  },
  {
    id: 'stadium-floodlight',
    name: 'Stadium Floodlight',
    category: 'sports',
    caption: 'Cool white lights, arena atmosphere',
    seed: 'stadflood',
    stylePrompt: `Stadium floodlight photography style. Cool-white color temperature (~6500K), very clean highlights that preserve detail, lifted dark shadows to simulate arena ambient fill light, neutral desaturated background, subjects sharply lit with high frequency detail preserved.${SUFFIX}`,
  },
  {
    id: 'gritty-monochrome',
    name: 'Gritty Monochrome',
    category: 'sports',
    caption: 'Black & white with raw texture',
    seed: 'grittymono',
    stylePrompt: `Gritty high-contrast monochrome sports style. Full desaturation, deep true blacks, bright whites, heavy grain texture, high clarity and micro-contrast especially on faces and muscles, film noir-inspired, strong shadows and directional light feel.${SUFFIX}`,
  },
  {
    id: 'electric-energy',
    name: 'Electric Energy',
    category: 'sports',
    caption: 'Vibrant, over-saturated digital look',
    seed: 'elecenergy',
    stylePrompt: `Electric energy sports style. Very high vibrance and saturation, particularly boosted blues and teals in background, warm orange-red on skin tones, high overall contrast, bright almost overexposed feel, commercial sports advertising energy, sharp throughout.${SUFFIX}`,
  },
  {
    id: 'fast-shutter-gold',
    name: 'Fast Shutter Gold',
    category: 'sports',
    caption: 'Golden tones, frozen peak moments',
    seed: 'fastgold',
    stylePrompt: `Fast shutter golden sports style. Warm amber-gold overall color grade (~4800K), slightly overexposed look, lifted shadows with warm brownish blacks, desaturated cool tones to let gold dominate, high local contrast on main subject, clean sharp detail on frozen motion.${SUFFIX}`,
  },
  {
    id: 'neon-arena',
    name: 'Neon Arena',
    category: 'sports',
    caption: 'Futuristic neon-lit venue glow',
    seed: 'neonarena',
    stylePrompt: `Neon arena sports style. Strong teal-blue shadows, warm orange highlights creating a split-tone effect, very high contrast, slightly crushed blacks, desaturated midtones making the neon tones pop, high frequency sharpness on subjects, modern eSports aesthetic.${SUFFIX}`,
  },
  {
    id: 'sideline-raw',
    name: 'Sideline Raw',
    category: 'sports',
    caption: 'Realistic, editorial photojournalism',
    seed: 'sidelineraw',
    stylePrompt: `Sideline photojournalism sports style. Realistic neutral color grade, moderate contrast, clean whites, natural skin tones, slight warm cast from artificial turf lighting (~4200K), low vibrance, sharp subjects with natural bokeh, editorial newspaper/wire agency look.${SUFFIX}`,
  },
  {
    id: 'track-day',
    name: 'Track Day',
    category: 'sports',
    caption: 'Speed and motion in warm light',
    seed: 'trackday',
    stylePrompt: `Track day motorsport style. Warm sunlit color grade, motion blur on wheels/background with sharp subject, high contrast with bright sun highlights rolling off to detail, saturated warm reds and oranges on vehicles, cool shadow fill, dramatic sky tones.${SUFFIX}`,
  },
  {
    id: 'aerial-dynamic',
    name: 'Aerial Dynamic',
    category: 'sports',
    caption: 'Top-down with vivid colors',
    seed: 'aerialdyn',
    stylePrompt: `Aerial dynamic sports style. Bright and airy overall exposure, saturated field greens and court blues, clean shadows, high detail throughout, slightly cool tone (~6000K), top-down perspective colors enhanced, vivid turf and court colors, neutral whites.${SUFFIX}`,
  },
  {
    id: 'night-game',
    name: 'Night Game',
    category: 'sports',
    caption: 'High ISO grain under stadium lights',
    seed: 'nightgame',
    stylePrompt: `Night game sports style. Mixed artificial light color cast (slight green-magenta crossover), intentional high ISO grain texture, deep black sky, strong rim lighting on subjects, lifted shadow noise, color grade neutralizing the mixed light to natural-ish skin tones.${SUFFIX}`,
  },
  {
    id: 'podium-glory',
    name: 'Podium Glory',
    category: 'sports',
    caption: 'Celebration moment — bright and warm',
    seed: 'podiumglory',
    stylePrompt: `Podium glory sports celebration style. Very warm, joyful color grade (~5200K), bright lifted exposure, creamy soft highlights, clean skin tones, boosted vibrancy in confetti/team colors, low vignette, open happy feel, high clarity on expressions, golden warm atmosphere.${SUFFIX}`,
  },
];

export const WILDLIFE_PRESETS: Preset[] = [
  {
    id: 'golden-hour-wildlife',
    name: 'Golden Hour',
    category: 'wildlife',
    caption: 'Warm dusk light on fur and feathers',
    seed: 'goldhourwild',
    stylePrompt: `Golden hour wildlife photography style. Warm amber-orange light (~3800K), beautiful highlight roll-off on fur and feather textures, deep golden shadows, high shadow detail with lifted blacks, specular highlights on eyes and wet surfaces, rich background bokeh in warm tones.${SUFFIX}`,
  },
  {
    id: 'moody-shadows',
    name: 'Moody Shadows',
    category: 'wildlife',
    caption: 'Dark, brooding atmosphere',
    seed: 'moodyshadows',
    stylePrompt: `Moody shadows wildlife style. Dark, atmospheric processing with deep crushed shadows, slight cool-blue shadow toning, warm amber highlights on subject, heavy vignette, desaturated background, subject isolated with high local contrast, dramatic stormy mood.${SUFFIX}`,
  },
  {
    id: 'forest-mist',
    name: 'Forest Mist',
    category: 'wildlife',
    caption: 'Ethereal soft haze in green tones',
    seed: 'forestmist',
    stylePrompt: `Forest mist wildlife photography style. Soft diffused light, lifted shadows creating a milky hazy feel, cool-green color cast with slight mist overlay, desaturated overall with greens gently boosted, soft contrast, atmospheric depth haze in background, dreamy texture.${SUFFIX}`,
  },
  {
    id: 'savanna-dusk',
    name: 'Savanna Dusk',
    category: 'wildlife',
    caption: 'African light — orange and teal split',
    seed: 'savannadusk',
    stylePrompt: `Savanna dusk wildlife style. Classic orange-teal color grade (warm orange in highlights, teal in shadows), high saturation in sky and warm tones, deep contrast, rim lighting on subjects from setting sun, dry grass colors enhanced, cinematic African safari feel.${SUFFIX}`,
  },
  {
    id: 'arctic-cool',
    name: 'Arctic Cool',
    category: 'wildlife',
    caption: 'Cold blue-white — snow and ice',
    seed: 'arcticcool',
    stylePrompt: `Arctic cool wildlife photography style. Cool blue-white color grade (~8000K), clean bright exposure with detail in snow highlights, blue-teal shadow fill, desaturated warm tones, high clarity on white fur texture detail, cold atmospheric feel, minimal vignette.${SUFFIX}`,
  },
  {
    id: 'dawn-serenity',
    name: 'Dawn Serenity',
    category: 'wildlife',
    caption: 'Quiet first light, pastel softness',
    seed: 'dawnserenity',
    stylePrompt: `Dawn serenity wildlife style. Soft pastel first-light coloring, very gentle warm pink-orange on horizon glow, quiet low-contrast look with lifted shadows, muted saturation, clean detail on subjects, hazy background bokeh, peaceful and intimate atmosphere.${SUFFIX}`,
  },
  {
    id: 'rainforest-lush',
    name: 'Rainforest Lush',
    category: 'wildlife',
    caption: 'Deep greens, tropical saturated',
    seed: 'rainforest',
    stylePrompt: `Rainforest lush wildlife style. Deep saturated greens and teals, high vibrance in foliage, slight warm fill on subjects, heavy ambient light bounce from green canopy, high micro-contrast on leaf textures, moist atmosphere glow, tropical color richness.${SUFFIX}`,
  },
  {
    id: 'desert-bronze',
    name: 'Desert Bronze',
    category: 'wildlife',
    caption: 'Arid heat — bronze and rust tones',
    seed: 'desertbronze',
    stylePrompt: `Desert bronze wildlife style. Deep bronze-rust color grade, strong warm cast (~4000K), high contrast with hard directional shadows, dust haze in distance, saturated ochre and sienna tones in sand, high detail in subject textures, harsh midday light feel.${SUFFIX}`,
  },
  {
    id: 'underwater-depth',
    name: 'Underwater Depth',
    category: 'wildlife',
    caption: 'Cool blue, diffused deep-sea light',
    seed: 'underwaterdepth',
    stylePrompt: `Underwater depth marine wildlife style. Strong cool blue-cyan color cast, light rays from above, high clarity on scales and textures, desaturated warm tones, soft caustice light pattern overlay feel, deep blue shadows, natural underwater color correction.${SUFFIX}`,
  },
  {
    id: 'night-vision',
    name: 'Night Vision',
    category: 'wildlife',
    caption: 'Nocturnal — grain and moonlight',
    seed: 'nightvision',
    stylePrompt: `Night vision nocturnal wildlife style. Very dark atmospheric processing, cool moonlight blue cast, intentional grain, isolated subject with directional rim light, deep true blacks, eyes with strong specular highlights, mysterious dark background, minimal ambient fill.${SUFFIX}`,
  },
  {
    id: 'spring-bloom',
    name: 'Spring Bloom',
    category: 'wildlife',
    caption: 'Fresh light, flowers, pastel warmth',
    seed: 'springbloom',
    stylePrompt: `Spring bloom wildlife style. Bright airy exposure, boosted pastel pinks and lavenders in background bokeh, warm neutral light on subjects, high vibrance in flower tones, clean highlights, gentle contrast, fresh optimistic feel, soft feathered edges.${SUFFIX}`,
  },
  {
    id: 'amber-backlight',
    name: 'Amber Backlight',
    category: 'wildlife',
    caption: 'Strong rim light — silhouette drama',
    seed: 'amberback',
    stylePrompt: `Amber backlight wildlife style. Strong backlit orange-amber rim light defining subject edges, dark silhouette-tending foreground, high contrast, specular glow on fur edges, deep shadow fill, rich amber sky tones, dramatic lighting with subject partially silhouetted.${SUFFIX}`,
  },
];

export const ALL_PRESETS: Preset[] = [...SPORTS_PRESETS, ...WILDLIFE_PRESETS];
