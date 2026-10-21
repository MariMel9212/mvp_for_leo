// Сборщик ДС walks a design system foundations sequence: palette and contrast,
// typography, spacing, radius, then elevation. The panel stays open so each
// step can be rebuilt. Output is a board on the current page plus styles and
// variables. Re-running a step updates the same names and does not delete
// tokens that are no longer in the scale.

const PANEL_WIDTH = 320
const RELAUNCH = '2c6c4c12-4418-4921-b805-5a9ae513879d'
const PREF_KEY = 'ds-prefs-v1'
const CONTENT_WIDTH = 1000
const BOARD_WIDTH = 1080

const INK: RGB = { r: 0.11, g: 0.11, b: 0.12 }
const MUTED: RGB = { r: 0.4, g: 0.4, b: 0.43 }
const PAPER: RGB = { r: 1, g: 1, b: 1 }
const WASH: RGB = { r: 0.955, g: 0.955, b: 0.965 }
const LINE: RGB = { r: 0.9, g: 0.9, b: 0.91 }
const WHITE: RGB = { r: 1, g: 1, b: 1 }
const BLACK: RGB = { r: 0, g: 0, b: 0 }
const ON_DARK: RGB = { r: 0.86, g: 0.86, b: 0.88 }

type StepId = 'palette' | 'type' | 'space' | 'radius' | 'elevation'
type Strength = 'Мягкие' | 'Обычные' | 'Жёсткие'
type Fonts = { regular: FontName; medium: FontName }

type Prefs = {
  step: StepId
  system: string
  role: string
  seed: string
  steps: 5 | 9 | 11
  family: string
  textStyle: string
  displayStyle: string
  baseSize: number
  ratio: number
  spaceBase: number
  spaceCount: number
  radiusBase: number
  strength: Strength
}

type Swatch = { step: number; color: RGB }

type Library = {
  paints: Map<string, PaintStyle>
  texts: Map<string, TextStyle>
  effects: Map<string, EffectStyle>
  collection: VariableCollection | null
  modeId: string | null
  variables: Map<string, Variable>
  canVariables: boolean
  warning: string
}

type UiMessage = {
  type?: string
  height?: number
  step?: unknown
  prefs?: unknown
}

const DEFAULT_PREFS: Prefs = {
  step: 'palette',
  system: 'DS',
  role: 'Brand',
  seed: '#266BEB',
  steps: 11,
  family: 'Inter',
  textStyle: 'Regular',
  displayStyle: 'Semi Bold',
  baseSize: 16,
  ratio: 1.25,
  spaceBase: 4,
  spaceCount: 8,
  radiusBase: 4,
  strength: 'Обычные',
}

const SPACE_STEPS = [
  { id: '2xs', mult: 0.5 },
  { id: 'xs', mult: 1 },
  { id: 'sm', mult: 2 },
  { id: 'md', mult: 3 },
  { id: 'lg', mult: 4 },
  { id: 'xl', mult: 6 },
  { id: '2xl', mult: 8 },
  { id: '3xl', mult: 12 },
]

const RADIUS_STEPS = [
  { id: 'none', label: 'None', resolve: (_base: number) => 0 },
  { id: 'xs', label: 'XS', resolve: (base: number) => Math.max(1, Math.round(base * 0.5)) },
  { id: 'sm', label: 'SM', resolve: (base: number) => base },
  { id: 'md', label: 'MD', resolve: (base: number) => base * 2 },
  { id: 'lg', label: 'LG', resolve: (base: number) => base * 3 },
  { id: 'xl', label: 'XL', resolve: (base: number) => base * 4 },
  { id: '2xl', label: '2XL', resolve: (base: number) => base * 6 },
  { id: 'full', label: 'Full', resolve: (_base: number) => 999 },
]

const ELEVATION_STEPS = [
  { id: 'xs', y: 1, blur: 2, alpha: 0.06 },
  { id: 'sm', y: 2, blur: 6, alpha: 0.08 },
  { id: 'md', y: 6, blur: 16, alpha: 0.1 },
  { id: 'lg', y: 16, blur: 40, alpha: 0.14 },
]

let running = false

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function clampInt(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min
  return Math.max(min, Math.min(max, Math.round(value)))
}

function readInt(value: unknown, min: number, max: number, fallback: number): number {
  const number = typeof value === 'number' ? value : Number(String(value ?? '').trim())
  if (!Number.isFinite(number)) return fallback
  return clampInt(number, min, max)
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object') return value as Record<string, unknown>
  return {}
}

function cleanName(value: unknown, max: number): string {
  return String(value ?? '')
    .replace(/[\\/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

function slug(value: string): string {
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9\-\u0400-\u04ff]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return cleaned || 'token'
}

function normalizeStep(value: unknown): StepId | null {
  const text = String(value ?? '').toLowerCase()
  if (text.indexOf('palette') !== -1 || text.indexOf('палитр') !== -1) return 'palette'
  if (text.indexOf('type') !== -1 || text.indexOf('типограф') !== -1) return 'type'
  if (text.indexOf('space') !== -1 || text.indexOf('отступ') !== -1) return 'space'
  if (text.indexOf('radius') !== -1 || text.indexOf('радиус') !== -1) return 'radius'
  if (text.indexOf('elevation') !== -1 || text.indexOf('тен') !== -1) return 'elevation'
  return null
}

function snapSteps(value: unknown): 5 | 9 | 11 {
  const number = Number(String(value ?? '').trim())
  if (number === 5 || number === 9 || number === 11) return number
  return 11
}

function snapRatio(value: unknown): number {
  const ratios = [1.125, 1.2, 1.25, 1.333]
  const number = Number(value)
  if (!Number.isFinite(number)) return 1.25
  let best = ratios[0]
  for (const ratio of ratios) {
    if (Math.abs(ratio - number) < Math.abs(best - number)) best = ratio
  }
  return best
}

function snapStrength(value: unknown): Strength {
  const text = String(value ?? '').trim()
  if (text === 'Мягкие' || text === 'Жёсткие' || text === 'Обычные') return text
  return 'Обычные'
}

function normalizePrefs(value: unknown, fallbackStep: StepId): Prefs {
  const raw = asRecord(value)
  const step = normalizeStep(raw.step) || fallbackStep
  const seed = parseHex(String(raw.seed ?? ''))
  return {
    step,
    system: cleanName(raw.system, 48),
    role: cleanName(raw.role, 40),
    seed: seed ? toHex(seed) : DEFAULT_PREFS.seed,
    steps: snapSteps(raw.steps),
    family: cleanName(raw.family, 80),
    textStyle: cleanName(raw.textStyle, 40) || DEFAULT_PREFS.textStyle,
    displayStyle: cleanName(raw.displayStyle, 40) || DEFAULT_PREFS.displayStyle,
    baseSize: readInt(raw.baseSize, 12, 24, DEFAULT_PREFS.baseSize),
    ratio: snapRatio(raw.ratio),
    spaceBase: readInt(raw.spaceBase, 2, 16, DEFAULT_PREFS.spaceBase),
    spaceCount: readInt(raw.spaceCount, 4, 8, DEFAULT_PREFS.spaceCount),
    radiusBase: readInt(raw.radiusBase, 2, 16, DEFAULT_PREFS.radiusBase),
    strength: snapStrength(raw.strength),
  }
}

function parseHex(input: string): RGB | null {
  const hex = input.trim().replace(/^#/, '')
  const full = hex.length === 3 ? hex.split('').map((channel) => channel + channel).join('') : hex.slice(0, 6)
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null
  return {
    r: parseInt(full.slice(0, 2), 16) / 255,
    g: parseInt(full.slice(2, 4), 16) / 255,
    b: parseInt(full.slice(4, 6), 16) / 255,
  }
}

function toHex(color: RGB): string {
  const channel = (value: number) => {
    const byte = clampInt(clamp(value, 0, 1) * 255, 0, 255).toString(16)
    return byte.length === 1 ? `0${byte}` : byte
  }
  return `#${channel(color.r)}${channel(color.g)}${channel(color.b)}`.toUpperCase()
}

function solid(color: RGB, opacity = 1): SolidPaint {
  return {
    type: 'SOLID',
    color: { r: clamp(color.r, 0, 1), g: clamp(color.g, 0, 1), b: clamp(color.b, 0, 1) },
    opacity: clamp(opacity, 0, 1),
  }
}

function rgbToHsl(color: RGB): { h: number; s: number; l: number } {
  const r = clamp(color.r, 0, 1)
  const g = clamp(color.g, 0, 1)
  const b = clamp(color.b, 0, 1)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h: number
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0)
  else if (max === g) h = (b - r) / d + 2
  else h = (r - g) / d + 4
  return { h: h / 6, s, l }
}

function hueToRgb(p: number, q: number, t: number): number {
  let channel = t
  if (channel < 0) channel += 1
  if (channel > 1) channel -= 1
  if (channel < 1 / 6) return p + (q - p) * 6 * channel
  if (channel < 1 / 2) return q
  if (channel < 2 / 3) return p + (q - p) * (2 / 3 - channel) * 6
  return p
}

function hslToRgb(h: number, s: number, l: number): RGB {
  if (s <= 0) {
    const gray = clamp(l, 0, 1)
    return { r: gray, g: gray, b: gray }
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  return {
    r: clamp(hueToRgb(p, q, h + 1 / 3), 0, 1),
    g: clamp(hueToRgb(p, q, h), 0, 1),
    b: clamp(hueToRgb(p, q, h - 1 / 3), 0, 1),
  }
}

function saturation(lightness: number, seedS: number): number {
  const highlight = Math.max(0, lightness - 0.62) / 0.38
  const shadow = Math.max(0, 0.22 - lightness) / 0.22
  return clamp(seedS * (1 - highlight * 0.85 - shadow * 0.15), 0, 1)
}

function scaleSteps(count: 5 | 9 | 11): number[] {
  if (count === 5) return [100, 300, 500, 700, 900]
  if (count === 9) return [50, 100, 200, 400, 500, 600, 800, 900, 950]
  return [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
}

function buildScale(seed: RGB, count: 5 | 9 | 11): Swatch[] {
  const hsl = rgbToHsl(seed)
  const steps = scaleSteps(count)
  const mid = steps.indexOf(500)
  const light = steps.slice(0, mid)
  const dark = steps.slice(mid + 1)
  let top = 0.97
  let bottom = 0.08
  if (hsl.l >= top) top = Math.min(1, hsl.l + (1 - hsl.l) * 0.55)
  if (hsl.l <= bottom) bottom = Math.max(0, hsl.l * 0.45)
  if (top < hsl.l) top = hsl.l
  if (bottom > hsl.l) bottom = hsl.l
  const result: Swatch[] = []
  const lightSpan = top - hsl.l
  const darkSpan = hsl.l - bottom
  for (let index = 0; index < light.length; index++) {
    const u = light.length <= 1 ? 0.5 : index / light.length
    const l = top - lightSpan * u
    result.push({ step: light[index], color: hslToRgb(hsl.h, saturation(l, hsl.s), l) })
  }
  result.push({ step: 500, color: seed })
  for (let index = 0; index < dark.length; index++) {
    const u = dark.length <= 1 ? 0.5 : (index + 1) / dark.length
    const l = hsl.l - darkSpan * u
    result.push({ step: dark[index], color: hslToRgb(hsl.h, saturation(l, hsl.s), l) })
  }
  return result
}

function linearize(channel: number): number {
  const value = clamp(channel, 0, 1)
  return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4)
}

function luminance(color: RGB): number {
  return 0.2126 * linearize(color.r) + 0.7152 * linearize(color.g) + 0.0722 * linearize(color.b)
}

function contrast(a: RGB, b: RGB): number {
  const left = luminance(a)
  const right = luminance(b)
  const lighter = Math.max(left, right)
  const darker = Math.min(left, right)
  return (lighter + 0.05) / (darker + 0.05)
}

function formatRatio(ratio: number): string {
  if (!Number.isFinite(ratio)) return '—'
  return ratio >= 10 ? ratio.toFixed(0) : ratio.toFixed(1)
}

function grade(ratio: number): string {
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  if (ratio >= 3) return 'крупный'
  return 'нет'
}

function bestInk(color: RGB): RGB {
  return contrast(color, WHITE) >= contrast(color, BLACK) ? WHITE : BLACK
}

function passingSteps(swatches: Swatch[], against: RGB): string {
  const steps = swatches.filter((swatch) => contrast(swatch.color, against) >= 4.5).map((swatch) => String(swatch.step))
  return steps.length ? steps.join(', ') : 'нет'
}

function post(message: { type: string; tone?: string; text?: string; busy?: boolean; prefs?: Prefs }) {
  figma.ui.postMessage(message)
}

function postStatus(tone: 'idle' | 'ok' | 'error', text: string) {
  post({ type: 'status', tone, text })
}

function errorText(error: unknown): string {
  const message = error instanceof Error ? error.message : 'Не удалось собрать этот шаг'
  return message.length > 240 ? message.slice(0, 240) : message
}

function arm(node: BaseNode & { setRelaunchData(data: { [command: string]: string }): void }) {
  node.setRelaunchData({ [RELAUNCH]: 'Продолжить сборку дизайн-системы' })
}

function solidAlias(color: RGB, variable: Variable | null): Paint {
  const paint = solid(color)
  if (!variable) return paint
  try {
    return figma.variables.setBoundVariableForPaint(paint, 'color', variable)
  } catch (_error) {
    return paint
  }
}

async function loadInter(): Promise<Fonts> {
  const regular: FontName = { family: 'Inter', style: 'Regular' }
  try {
    await figma.loadFontAsync(regular)
  } catch (_error) {
    throw new Error('Не удалось загрузить Inter. Он нужен для подписей на холсте.')
  }
  const medium: FontName = { family: 'Inter', style: 'Medium' }
  try {
    await figma.loadFontAsync(medium)
    return { regular, medium }
  } catch (_error) {
    return { regular, medium: regular }
  }
}

async function requireFont(family: string, style: string): Promise<FontName> {
  const available = await figma.listAvailableFontsAsync()
  const faces = available.filter((font) => font.fontName.family === family)
  const known: string[] = []
  for (const face of faces) {
    if (known.indexOf(face.fontName.style) === -1) known.push(face.fontName.style)
  }
  if (known.indexOf(style) === -1) {
    throw new Error(
      known.length
        ? `В семействе ${family} нет начертания «${style}». Доступны: ${known.slice(0, 6).join(', ')}`
        : `Шрифт «${family}» не найден. Возьмите имя так, как оно записано в Figma.`,
    )
  }
  const font: FontName = { family, style }
  await figma.loadFontAsync(font)
  return font
}

async function openLibrary(system: string): Promise<Library> {
  const paints = new Map<string, PaintStyle>()
  for (const style of await figma.getLocalPaintStylesAsync()) paints.set(style.name, style)
  const texts = new Map<string, TextStyle>()
  for (const style of await figma.getLocalTextStylesAsync()) texts.set(style.name, style)
  const effects = new Map<string, EffectStyle>()
  for (const style of await figma.getLocalEffectStylesAsync()) effects.set(style.name, style)

  const library: Library = {
    paints,
    texts,
    effects,
    collection: null,
    modeId: null,
    variables: new Map<string, Variable>(),
    canVariables: true,
    warning: '',
  }

  try {
    const collections = await figma.variables.getLocalVariableCollectionsAsync()
    const existing = collections.find((item) => item.name === system) || null
    library.collection = existing
    if (existing && existing.modes[0]) {
      library.modeId = existing.modes[0].modeId
      for (const variable of await figma.variables.getLocalVariablesAsync()) {
        if (variable.variableCollectionId === existing.id) library.variables.set(variable.name, variable)
      }
    }
  } catch (_error) {
    library.canVariables = false
    library.warning = 'Переменные в этом файле недоступны.'
  }
  return library
}

function ensureCollection(library: Library, system: string) {
  if (!library.canVariables) return
  if (!library.collection) {
    try {
      const collection = figma.variables.createVariableCollection(system)
      const modeId = collection.modes[0].modeId
      collection.renameMode(modeId, 'Value')
      library.collection = collection
      library.modeId = modeId
    } catch (_error) {
      library.canVariables = false
      library.warning = 'Не удалось создать коллекцию переменных.'
    }
  }
}

function noteVariableFailure(library: Library) {
  if (library.warning.indexOf('другим типом') !== -1) return
  const note = 'Часть переменных не обновилась: имя уже занято другим типом.'
  library.warning = library.warning ? `${library.warning} ${note}` : note
}

function rememberSyntax(variable: Variable, name: string) {
  try {
    variable.setVariableCodeSyntax('WEB', `var(--${name.replace(/\//g, '-')})`)
  } catch (_error) {
    // Code syntax is a convenience. The token value still stands without it.
  }
}

function upsertVariable(library: Library, name: string, resolvedType: VariableResolvedDataType, value: VariableValue, scopes: VariableScope[], description: string): Variable | null {
  if (!library.canVariables || !library.collection || !library.modeId) return null
  let variable = library.variables.get(name) || null
  const created = !variable
  if (!variable) {
    try {
      variable = figma.variables.createVariable(name, library.collection, resolvedType)
      library.variables.set(name, variable)
    } catch (_error) {
      noteVariableFailure(library)
      return null
    }
  }
  try {
    variable.setValueForMode(library.modeId, value)
  } catch (_error) {
    noteVariableFailure(library)
    return null
  }
  variable.description = description
  if (created) {
    try {
      variable.scopes = scopes
    } catch (_error) {
      // Default scopes still publish the value.
    }
  }
  rememberSyntax(variable, name)
  return variable
}

function upsertColor(library: Library, name: string, color: RGB, description: string): Variable | null {
  return upsertVariable(library, name, 'COLOR', { r: color.r, g: color.g, b: color.b, a: 1 }, ['ALL_FILLS', 'STROKE_COLOR'], description)
}

function upsertFloat(library: Library, name: string, value: number, scopes: VariableScope[], description: string): Variable | null {
  return upsertVariable(library, name, 'FLOAT', value, scopes, description)
}

function upsertString(library: Library, name: string, value: string, scopes: VariableScope[], description: string): Variable | null {
  return upsertVariable(library, name, 'STRING', value, scopes, description)
}

function upsertPaint(library: Library, name: string, color: RGB, variable: Variable | null, description: string): PaintStyle {
  let style = library.paints.get(name)
  if (!style) {
    style = figma.createPaintStyle()
    style.name = name
    library.paints.set(name, style)
  }
  style.paints = [solidAlias(color, variable)]
  style.description = description
  return style
}

function upsertText(library: Library, name: string, font: FontName, size: number, leading: number, tracking: number, description: string): TextStyle {
  let style = library.texts.get(name)
  if (!style) {
    style = figma.createTextStyle()
    style.name = name
    library.texts.set(name, style)
  }
  style.fontName = font
  style.fontSize = size
  style.lineHeight = { unit: 'PIXELS', value: leading }
  style.letterSpacing = { unit: 'PERCENT', value: tracking }
  style.description = description
  return style
}

function upsertEffect(library: Library, name: string, effect: DropShadowEffect, description: string): EffectStyle {
  let style = library.effects.get(name)
  if (!style) {
    style = figma.createEffectStyle()
    style.name = name
    library.effects.set(name, style)
  }
  style.effects = [effect]
  style.description = description
  return style
}

function findPart(board: FrameNode, part: string): FrameNode | null {
  for (const child of board.children) {
    if (child.type === 'FRAME' && child.getPluginData('part') === part) return child
  }
  return null
}

function findBoard(system: string): FrameNode | null {
  for (const child of figma.currentPage.children) {
    if (child.type === 'FRAME' && child.getPluginData('ds') === 'board' && child.getPluginData('system') === system) return child
  }
  return null
}

function addText(parent: FrameNode, characters: string, size: number, font: FontName, color: RGB, width?: number): TextNode {
  const node = figma.createText()
  node.fontName = font
  node.characters = characters
  node.fontSize = size
  node.fills = [solid(color)]
  node.lineHeight = { unit: 'PIXELS', value: Math.max(size + 2, Math.round(size * 1.35)) }
  if (width) {
    node.textAutoResize = 'HEIGHT'
    node.resize(width, Math.max(size * 1.4, 16))
  } else {
    node.textAutoResize = 'WIDTH_AND_HEIGHT'
  }
  parent.appendChild(node)
  node.layoutSizingHorizontal = width ? 'FIXED' : 'HUG'
  node.layoutSizingVertical = 'HUG'
  return node
}

function makeStack(parent: FrameNode, name: string, spacing: number): FrameNode {
  const frame = figma.createFrame()
  frame.name = name
  frame.fills = []
  frame.strokes = []
  frame.clipsContent = false
  frame.layoutMode = 'VERTICAL'
  frame.itemSpacing = spacing
  frame.primaryAxisAlignItems = 'MIN'
  frame.counterAxisAlignItems = 'MIN'
  frame.primaryAxisSizingMode = 'AUTO'
  frame.counterAxisSizingMode = 'AUTO'
  parent.appendChild(frame)
  frame.layoutSizingHorizontal = 'HUG'
  frame.layoutSizingVertical = 'HUG'
  return frame
}

function fixStack(frame: FrameNode, width: number, height: number | null) {
  frame.resize(width, height == null ? Math.max(frame.height, 1) : height)
  frame.layoutSizingHorizontal = 'FIXED'
  frame.layoutSizingVertical = height == null ? 'HUG' : 'FIXED'
  frame.primaryAxisSizingMode = height == null ? 'AUTO' : 'FIXED'
  frame.counterAxisSizingMode = 'FIXED'
}

function makeRow(parent: FrameNode, name: string, spacing: number): FrameNode {
  const row = figma.createFrame()
  row.name = name
  row.fills = []
  row.strokes = []
  row.clipsContent = false
  row.layoutMode = 'HORIZONTAL'
  row.itemSpacing = spacing
  row.primaryAxisAlignItems = 'MIN'
  row.counterAxisAlignItems = 'CENTER'
  row.primaryAxisSizingMode = 'AUTO'
  row.counterAxisSizingMode = 'AUTO'
  parent.appendChild(row)
  row.layoutSizingHorizontal = 'HUG'
  row.layoutSizingVertical = 'HUG'
  return row
}

function fixRow(row: FrameNode, width: number, wrap: boolean) {
  if (wrap) {
    row.layoutWrap = 'WRAP'
    row.counterAxisSpacing = 16
    row.counterAxisAlignItems = 'MIN'
  }
  row.resize(width, Math.max(row.height, 1))
  row.primaryAxisSizingMode = 'FIXED'
  row.counterAxisSizingMode = 'AUTO'
  row.layoutSizingHorizontal = 'FIXED'
  row.layoutSizingVertical = 'HUG'
}

function prepareSection(board: FrameNode, part: string, name: string, wash: boolean): { frame: FrameNode; created: boolean } {
  let frame = findPart(board, part)
  const created = frame == null
  if (!frame) {
    frame = figma.createFrame()
    frame.setPluginData('part', part)
    board.appendChild(frame)
  } else {
    for (const child of [...frame.children]) child.remove()
  }
  frame.name = name
  frame.clipsContent = false
  frame.layoutMode = 'VERTICAL'
  frame.itemSpacing = 12
  frame.primaryAxisAlignItems = 'MIN'
  frame.counterAxisAlignItems = 'MIN'
  frame.paddingTop = wash ? 24 : 0
  frame.paddingBottom = wash ? 24 : 0
  frame.paddingLeft = wash ? 24 : 0
  frame.paddingRight = wash ? 24 : 0
  frame.cornerRadius = wash ? 16 : 0
  frame.fills = wash ? [solid(WASH)] : []
  frame.strokes = []
  frame.resize(CONTENT_WIDTH, Math.max(frame.height, 1))
  frame.primaryAxisSizingMode = 'AUTO'
  frame.counterAxisSizingMode = 'FIXED'
  frame.layoutSizingHorizontal = 'FIXED'
  frame.layoutSizingVertical = 'HUG'
  return { frame, created }
}

function configureBoard(board: FrameNode) {
  board.layoutMode = 'VERTICAL'
  board.itemSpacing = 32
  board.paddingTop = 36
  board.paddingBottom = 40
  board.paddingLeft = 40
  board.paddingRight = 40
  board.primaryAxisAlignItems = 'MIN'
  board.counterAxisAlignItems = 'MIN'
  board.clipsContent = false
  board.fills = [solid(PAPER)]
  board.strokes = []
  board.cornerRadius = 20
  board.resize(BOARD_WIDTH, Math.max(board.height, 1))
  board.primaryAxisSizingMode = 'AUTO'
  board.counterAxisSizingMode = 'FIXED'
}

function ensureBoard(system: string, fonts: Fonts): { board: FrameNode; created: boolean } {
  let board = findBoard(system)
  const created = board == null
  if (!board) {
    board = figma.createFrame()
    board.setPluginData('ds', 'board')
    board.setPluginData('system', system)
    figma.currentPage.appendChild(board)
  }
  board.name = `${system} · Основы`
  configureBoard(board)
  if (created) {
    board.x = Math.round(figma.viewport.center.x - BOARD_WIDTH / 2)
    board.y = Math.round(figma.viewport.center.y - 80)
  }
  const header = prepareSection(board, 'header', system, false)
  header.frame.itemSpacing = 6
  addText(header.frame, system, 28, fonts.medium, INK)
  addText(header.frame, 'Основы дизайн-системы. Стили и переменные носят имя системы. Повторный запуск обновляет тот же шаг и не удаляет старые имена.', 13, fonts.regular, MUTED, CONTENT_WIDTH)
  return { board, created }
}

function sortBoard(board: FrameNode) {
  const rank = (node: SceneNode) => {
    const part = node.getPluginData('part')
    if (part === 'header') return '0'
    if (part.indexOf('palette:') === 0) return `1${part}`
    if (part === 'type') return '2'
    if (part === 'space') return '3'
    if (part === 'radius') return '4'
    if (part === 'elevation') return '5'
    return `9${part}`
  }
  const children = [...board.children].sort((a, b) => rank(a).localeCompare(rank(b)))
  for (let index = 0; index < children.length; index++) {
    if (board.children[index] !== children[index]) board.insertChild(index, children[index])
  }
}

function finish(board: FrameNode, section: FrameNode, createdBoard: boolean, notice: string, status: string, library: Library) {
  sortBoard(board)
  arm(board)
  figma.currentPage.selection = [section]
  if (createdBoard) figma.viewport.scrollAndZoomIntoView([board])
  const warning = library.warning ? ` ${library.warning}` : ''
  figma.notify(notice)
  postStatus('ok', `${status}${warning}`)
}

async function paintSwatch(parent: FrameNode, swatch: Swatch, style: PaintStyle, fonts: Fonts) {
  const chip = makeStack(parent, String(swatch.step), 6)
  fixStack(chip, 152, null)
  const onWhite = contrast(swatch.color, WHITE)
  const onBlack = contrast(swatch.color, BLACK)
  const ink = bestInk(swatch.color)
  const block = makeStack(chip, 'Образец', 4)
  fixStack(block, 152, 104)
  block.paddingTop = 10
  block.paddingRight = 10
  block.paddingBottom = 10
  block.paddingLeft = 10
  block.cornerRadius = 12
  block.primaryAxisAlignItems = 'SPACE_BETWEEN'
  await block.setFillStyleIdAsync(style.id)
  block.strokes = [solid(BLACK, 0.08)]
  block.strokeWeight = 1
  block.strokeAlign = 'INSIDE'
  addText(block, String(swatch.step), 13, fonts.medium, ink)
  addText(block, `Aa · ${formatRatio(Math.max(onWhite, onBlack))}`, 12, fonts.medium, ink)
  addText(chip, toHex(swatch.color), 11, fonts.medium, INK, 152)
  addText(chip, `Белый · ${formatRatio(onWhite)} ${grade(onWhite)}`, 11, fonts.regular, MUTED, 152)
  addText(chip, `Чёрный · ${formatRatio(onBlack)} ${grade(onBlack)}`, 11, fonts.regular, MUTED, 152)
}

async function testPlate(parent: FrameNode, name: string, width: number, fill: RGB | null, style: PaintStyle | null, title: string, detail: string, titleColor: RGB, sampleColor: RGB, sampleVariable: Variable | null, fonts: Fonts) {
  const plate = makeStack(parent, name, 8)
  fixStack(plate, width, 136)
  plate.paddingTop = 14
  plate.paddingRight = 14
  plate.paddingBottom = 14
  plate.paddingLeft = 14
  plate.cornerRadius = 12
  plate.primaryAxisAlignItems = 'SPACE_BETWEEN'
  if (style) await plate.setFillStyleIdAsync(style.id)
  else if (fill) plate.fills = [solid(fill)]
  plate.strokes = [solid(BLACK, fill === WHITE ? 0.08 : 0.12)]
  plate.strokeWeight = 1
  plate.strokeAlign = 'INSIDE'
  addText(plate, title, 12, fonts.regular, titleColor)
  const sample = addText(plate, 'Aa', 36, fonts.medium, sampleColor)
  if (sampleVariable) sample.fills = [solidAlias(sampleColor, sampleVariable)]
  addText(plate, detail, 12, fonts.regular, titleColor)
}

async function buildPalette(prefs: Prefs, fonts: Fonts) {
  const system = prefs.system
  const role = prefs.role
  const seed = parseHex(prefs.seed)
  if (!system) throw new Error('Введите название системы')
  if (!role) throw new Error('Введите роль цвета, например Brand')
  if (!seed) throw new Error('Выберите базовый цвет')
  const swatches = buildScale(seed, prefs.steps)
  const library = await openLibrary(system)
  const roleSlug = slug(role)
  const { board, created } = ensureBoard(system, fonts)
  ensureCollection(library, system)
  const section = prepareSection(board, `palette:${roleSlug}`, `Палитра · ${role}`, false)
  addText(section.frame, `Палитра · ${role}`, 20, fonts.medium, INK)
  addText(section.frame, 'Контраст WCAG для обычного текста: AAA от 7:1, AA от 4.5:1. «Крупный» — от 3:1 и годится только крупному тексту.', 13, fonts.regular, MUTED, CONTENT_WIDTH)

  const seedSwatch = swatches.filter((item) => item.step === 500)[0] || swatches[0]
  const descriptionFor = (swatch: Swatch) => {
    const onWhite = contrast(swatch.color, WHITE)
    const onBlack = contrast(swatch.color, BLACK)
    return `${toHex(swatch.color)} · белый ${formatRatio(onWhite)} ${grade(onWhite)} · чёрный ${formatRatio(onBlack)} ${grade(onBlack)}`
  }
  const variables = new Map<number, Variable | null>()
  const styles = new Map<number, PaintStyle>()
  for (const swatch of swatches) {
    const description = descriptionFor(swatch)
    const variable = upsertColor(library, `color/${roleSlug}/${swatch.step}`, swatch.color, description)
    variables.set(swatch.step, variable)
    styles.set(swatch.step, upsertPaint(library, `${system}/color/${role}/${swatch.step}`, swatch.color, variable, description))
  }

  const onWhite = contrast(seedSwatch.color, WHITE)
  const onBlack = contrast(seedSwatch.color, BLACK)
  const ink = bestInk(seedSwatch.color)
  const plates = makeRow(section.frame, 'Проверка', 12)
  const plateWidth = Math.floor((CONTENT_WIDTH - 24) / 3)
  fixRow(plates, CONTENT_WIDTH, false)
  const seedStyle = styles.get(seedSwatch.step) || null
  const seedVariable = variables.get(seedSwatch.step) || null
  if (seedStyle) {
    await testPlate(plates, 'Заливка', plateWidth, null, seedStyle, 'Заливка', `${formatRatio(Math.max(onWhite, onBlack))} · ${grade(Math.max(onWhite, onBlack))}`, ink, ink, null, fonts)
  }
  await testPlate(plates, 'На белом', plateWidth, WHITE, null, 'На белом', `${formatRatio(onWhite)} · ${grade(onWhite)}`, MUTED, seedSwatch.color, seedVariable, fonts)
  await testPlate(plates, 'На чёрном', plateWidth, BLACK, null, 'На чёрном', `${formatRatio(onBlack)} · ${grade(onBlack)}`, ON_DARK, seedSwatch.color, seedVariable, fonts)

  addText(section.frame, `AA на белом: ${passingSteps(swatches, WHITE)}`, 13, fonts.regular, INK, CONTENT_WIDTH)
  addText(section.frame, `AA на чёрном: ${passingSteps(swatches, BLACK)}`, 13, fonts.regular, INK, CONTENT_WIDTH)

  const grid = makeRow(section.frame, 'Шкала', 12)
  fixRow(grid, CONTENT_WIDTH, true)
  for (const swatch of swatches) {
    const style = styles.get(swatch.step)
    if (style) await paintSwatch(grid, swatch, style, fonts)
  }

  finish(
    board,
    section.frame,
    created,
    `Палитра ${role} ${section.created ? 'собрана' : 'обновлена'}`,
    `Палитра ${role} на доске «${system} · Основы». AA на белом: ${passingSteps(swatches, WHITE)}. AA на чёрном: ${passingSteps(swatches, BLACK)}.`,
    library,
  )
}

type TypeSpec = {
  id: string
  name: string
  sample: string
  power: number
  tracking: number
  kind: 'text' | 'display'
}

const TYPE_SPECS: TypeSpec[] = [
  { id: 'caption', name: 'Caption', sample: 'Подпись · 12:30', power: -1, tracking: 0, kind: 'text' },
  { id: 'body', name: 'Body', sample: 'Соберите иерархию и проверьте, как текст держит ритм.', power: 0, tracking: 0, kind: 'text' },
  { id: 'body-lg', name: 'Body large', sample: 'Крупный абзац для вводных и важных пояснений.', power: 1, tracking: 0, kind: 'text' },
  { id: 'title', name: 'Title', sample: 'Заголовок блока', power: 2, tracking: 0, kind: 'display' },
  { id: 'heading', name: 'Heading', sample: 'Заголовок секции', power: 3, tracking: -1, kind: 'display' },
  { id: 'display', name: 'Display', sample: 'Дисплей', power: 4, tracking: -2, kind: 'display' },
]

async function buildType(prefs: Prefs, fonts: Fonts) {
  if (!prefs.system) throw new Error('Введите название системы')
  if (!prefs.family) throw new Error('Введите семейство шрифта')
  const textFont = await requireFont(prefs.family, prefs.textStyle)
  const displayFont = prefs.displayStyle === prefs.textStyle ? textFont : await requireFont(prefs.family, prefs.displayStyle)
  const library = await openLibrary(prefs.system)
  const { board, created } = ensureBoard(prefs.system, fonts)
  ensureCollection(library, prefs.system)
  upsertString(library, 'font/family', prefs.family, ['FONT_FAMILY'], prefs.family)
  const section = prepareSection(board, 'type', 'Типографика', false)
  addText(section.frame, 'Типографика', 20, fonts.medium, INK)
  addText(section.frame, `${prefs.family} · текст ${prefs.textStyle} · заголовки ${prefs.displayStyle} · база ${prefs.baseSize} · коэффициент ${prefs.ratio}`, 13, fonts.regular, MUTED, CONTENT_WIDTH)

  let smallest = 0
  let largest = 0
  for (const spec of TYPE_SPECS) {
    const size = clampInt(Math.round(prefs.baseSize * Math.pow(prefs.ratio, spec.power)), 10, 96)
    const factor = spec.id === 'display' || spec.id === 'heading' ? 1.15 : spec.id === 'title' ? 1.25 : 1.45
    const leading = Math.max(size + 2, Math.round(size * factor))
    const face = spec.kind === 'display' ? displayFont : textFont
    const description = `${size} / ${leading} · ${face.family} ${face.style}`
    const style = upsertText(library, `${prefs.system}/type/${spec.name}`, face, size, leading, spec.tracking, description)
    upsertFloat(library, `font/size/${spec.id}`, size, ['FONT_SIZE'], description)
    upsertFloat(library, `font/line/${spec.id}`, leading, ['LINE_HEIGHT'], description)
    if (!smallest || size < smallest) smallest = size
    if (size > largest) largest = size

    const row = makeRow(section.frame, spec.name, 20)
    fixRow(row, CONTENT_WIDTH, false)
    row.counterAxisAlignItems = 'MIN'
    const meta = makeStack(row, 'Мета', 4)
    fixStack(meta, 188, null)
    addText(meta, spec.name, 13, fonts.medium, INK, 188)
    addText(meta, `${size} / ${leading}`, 12, fonts.regular, MUTED, 188)
    addText(meta, face.style, 12, fonts.regular, MUTED, 188)
    const sample = addText(row, spec.sample, size, face, INK, 776)
    sample.lineHeight = { unit: 'PIXELS', value: leading }
    sample.letterSpacing = { unit: 'PERCENT', value: spec.tracking }
    await sample.setTextStyleIdAsync(style.id)
  }

  finish(
    board,
    section.frame,
    created,
    `Типографика ${section.created ? 'собрана' : 'обновлена'}`,
    `Типографика на доске «${prefs.system} · Основы»: ${prefs.family}, ${smallest}–${largest} px, 6 стилей.`,
    library,
  )
}

async function buildSpace(prefs: Prefs, fonts: Fonts) {
  if (!prefs.system) throw new Error('Введите название системы')
  const steps = SPACE_STEPS.slice(0, prefs.spaceCount)
  const library = await openLibrary(prefs.system)
  const { board, created } = ensureBoard(prefs.system, fonts)
  ensureCollection(library, prefs.system)
  const section = prepareSection(board, 'space', 'Отступы', false)
  addText(section.frame, 'Отступы', 20, fonts.medium, INK)
  addText(section.frame, `База ${prefs.spaceBase} px. Имена space/* обновляются на месте. Лишние старые ступени не удаляются.`, 13, fonts.regular, MUTED, CONTENT_WIDTH)
  let first = 0
  let last = 0
  for (const step of steps) {
    const px = Math.max(1, Math.round(prefs.spaceBase * step.mult))
    first = first || px
    last = px
    const variable = upsertFloat(library, `space/${step.id}`, px, ['GAP', 'WIDTH_HEIGHT'], `${px} px`)
    const row = makeRow(section.frame, step.id, 12)
    const name = makeStack(row, 'Имя', 0)
    fixStack(name, 72, null)
    addText(name, step.id, 13, fonts.medium, INK, 72)
    const value = makeStack(row, 'Значение', 0)
    fixStack(value, 56, null)
    addText(value, String(px), 13, fonts.regular, MUTED, 56)
    const bar = figma.createRectangle()
    bar.name = `${step.id} · ${px}`
    bar.resize(Math.max(px, 2), 8)
    bar.cornerRadius = 4
    bar.fills = [solid(INK)]
    row.appendChild(bar)
    bar.layoutSizingHorizontal = 'FIXED'
    bar.layoutSizingVertical = 'FIXED'
    if (variable) {
      try {
        bar.setBoundVariable('width', variable)
      } catch (_error) {
        // The drawn width still matches the token if binding is unavailable.
      }
    }
  }
  finish(
    board,
    section.frame,
    created,
    `Отступы ${section.created ? 'собраны' : 'обновлены'}`,
    `Отступы на доске «${prefs.system} · Основы»: ${steps.length} ступеней, от ${first} до ${last} px.`,
    library,
  )
}

async function buildRadius(prefs: Prefs, fonts: Fonts) {
  if (!prefs.system) throw new Error('Введите название системы')
  const library = await openLibrary(prefs.system)
  const { board, created } = ensureBoard(prefs.system, fonts)
  ensureCollection(library, prefs.system)
  const section = prepareSection(board, 'radius', 'Радиусы', false)
  addText(section.frame, 'Радиусы', 20, fonts.medium, INK)
  addText(section.frame, `База ${prefs.radiusBase} px. Full равен 999 и на образце выглядит кругом.`, 13, fonts.regular, MUTED, CONTENT_WIDTH)
  const row = makeRow(section.frame, 'Шкала', 12)
  fixRow(row, CONTENT_WIDTH, true)
  for (const step of RADIUS_STEPS) {
    const px = step.resolve(prefs.radiusBase)
    upsertFloat(library, `radius/${step.id}`, px, ['CORNER_RADIUS'], px === 999 ? 'Полное скругление' : `${px} px`)
    const item = makeStack(row, step.label, 6)
    fixStack(item, 112, null)
    const box = figma.createRectangle()
    box.name = step.label
    box.resize(96, 96)
    box.cornerRadius = px
    box.fills = [solid(WASH)]
    box.strokes = [solid(LINE)]
    box.strokeWeight = 1
    item.appendChild(box)
    box.layoutSizingHorizontal = 'FIXED'
    box.layoutSizingVertical = 'FIXED'
    addText(item, step.label, 12, fonts.medium, INK, 112)
    addText(item, px === 999 ? '999' : String(px), 12, fonts.regular, MUTED, 112)
  }
  finish(
    board,
    section.frame,
    created,
    `Радиусы ${section.created ? 'собраны' : 'обновлены'}`,
    `Радиусы на доске «${prefs.system} · Основы»: база ${prefs.radiusBase} px, от 0 до full.`,
    library,
  )
}

async function buildElevation(prefs: Prefs, fonts: Fonts) {
  if (!prefs.system) throw new Error('Введите название системы')
  const factor = prefs.strength === 'Мягкие' ? { blur: 0.7, alpha: 0.7 } : prefs.strength === 'Жёсткие' ? { blur: 1.35, alpha: 1.4 } : { blur: 1, alpha: 1 }
  const library = await openLibrary(prefs.system)
  const { board, created } = ensureBoard(prefs.system, fonts)
  ensureCollection(library, prefs.system)
  const section = prepareSection(board, 'elevation', 'Тени', true)
  const inner = CONTENT_WIDTH - 48
  addText(section.frame, 'Тени', 20, fonts.medium, INK)
  addText(section.frame, `Сила «${prefs.strength}». Стили эффектов и числовые переменные y, blur и alpha.`, 13, fonts.regular, MUTED, inner)
  const row = makeRow(section.frame, 'Уровни', 12)
  const cardWidth = Math.floor((inner - 36) / 4)
  fixRow(row, inner, false)
  for (const step of ELEVATION_STEPS) {
    const blur = Math.max(1, Math.round(step.blur * factor.blur))
    const alpha = clamp(step.alpha * factor.alpha, 0.03, 0.5)
    const description = `Смещение ${step.y}, размытие ${blur}, прозрачность ${Math.round(alpha * 100)}%`
    const effect: DropShadowEffect = {
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: alpha },
      offset: { x: 0, y: step.y },
      radius: blur,
      spread: 0,
      visible: true,
      blendMode: 'NORMAL',
    }
    const style = upsertEffect(library, `${prefs.system}/elevation/${step.id}`, effect, description)
    upsertFloat(library, `elevation/${step.id}/y`, step.y, ['EFFECT_FLOAT'], `${step.y} px`)
    upsertFloat(library, `elevation/${step.id}/blur`, blur, ['EFFECT_FLOAT'], `${blur} px`)
    upsertFloat(library, `elevation/${step.id}/alpha`, Math.round(alpha * 1000) / 1000, ['EFFECT_FLOAT'], 'Доля от 0 до 1')
    const card = makeStack(row, step.id, 6)
    fixStack(card, cardWidth, 132)
    card.paddingTop = 14
    card.paddingRight = 14
    card.paddingBottom = 14
    card.paddingLeft = 14
    card.cornerRadius = 16
    card.primaryAxisAlignItems = 'SPACE_BETWEEN'
    card.fills = [solid(PAPER)]
    await card.setEffectStyleIdAsync(style.id)
    addText(card, step.id, 16, fonts.medium, INK)
    addText(card, `y ${step.y} · blur ${blur}`, 12, fonts.regular, MUTED, Math.max(40, cardWidth - 28))
  }
  finish(
    board,
    section.frame,
    created,
    `Тени ${section.created ? 'собраны' : 'обновлены'}`,
    `Тени на доске «${prefs.system} · Основы»: xs, sm, md, lg, сила «${prefs.strength}».`,
    library,
  )
}

async function onMessage(message: UiMessage) {
  if (!message || message.type === 'resize') {
    const height = Math.round(Number(message && message.height))
    if (Number.isFinite(height)) figma.ui.resize(PANEL_WIDTH, clampInt(height, 180, 900))
    return
  }
  if (message.type === 'ready') {
    const prefs = await readStoredPrefs()
    post({ type: 'prefs', prefs })
    return
  }
  if (message.type !== 'run') return
  if (running) return
  running = true
  post({ type: 'busy', busy: true })
  try {
    const step = normalizeStep(message.step)
    const prefs = normalizePrefs(message.prefs, step || 'palette')
    if (!step) throw new Error('Выберите шаг сборки')
    if (!prefs.system) throw new Error('Введите название системы')
    const fonts = await loadInter()
    if (step === 'palette') await buildPalette(prefs, fonts)
    else if (step === 'type') await buildType(prefs, fonts)
    else if (step === 'space') await buildSpace(prefs, fonts)
    else if (step === 'radius') await buildRadius(prefs, fonts)
    else await buildElevation(prefs, fonts)
    const stored: Prefs = { ...prefs, step, system: prefs.system }
    try {
      await figma.clientStorage.setAsync(PREF_KEY, stored)
    } catch (_error) {
      // The board is already built; remembering the form is optional.
    }
  } catch (_error) {
    postStatus('error', errorText(_error))
  } finally {
    running = false
    post({ type: 'busy', busy: false })
  }
}

async function readStoredPrefs(): Promise<Prefs> {
  try {
    const stored = await figma.clientStorage.getAsync(PREF_KEY)
    return normalizePrefs(stored, 'palette')
  } catch (_error) {
    return normalizePrefs(undefined, 'palette')
  }
}

arm(figma.root)
arm(figma.currentPage)
figma.showUI(__html__, { width: PANEL_WIDTH, height: 560 })
figma.ui.onmessage = (message: UiMessage) => {
  void onMessage(message)
}
