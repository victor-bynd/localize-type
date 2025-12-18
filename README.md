# Localize Type

**A powerful web-based tool for stress-testing and fine-tuning font stacks across global languages.**

Localize Type helps designers and developers gain granular control over typography when "brand fonts" need to share the stage with system or fallback fonts for localized content.

## Why Localize Type?

Typography is often designed with a single primary language in mind. However, when your application scales to support global languages (Greek, Cyrillic, Thai, Arabic, CJK, etc.), your carefully chosen "Brand Font" may drop characters it doesn't support.

This forces the browser to rely on **Fallback Fonts**, which often leads to:
- **Visual Inconsistency:** Fallback fonts may look heavier, lighter, larger, or smaller than your primary font.
- **Layout Shifts:** A paragraph in Thai might take up 20% more vertical space than English due to different line-height metrics.
- **"Tofu" & Missing Glyphs:** Without a proper strategy, users see empty boxes (□) instead of text.
- **Baseline Alignment Issues:** Mixing fonts often breaks the visual rhythm of your text.

**Localize Type** solves this by letting you:
1.  **Visualize** exactly where your primary font fails and fallback fonts take over.
2.  **Tune** the fallback fonts (scale, weight, line-height) to match your primary font perfectly.
3.  **Export** production-ready CSS to ensure your live site looks exactly like your design.

---

## Key Features

### 1. Smart Font Stacking
- **Drag & Drop:** Upload your primary font (`.ttf`, `.otf`, `.woff`, `.woff2`) and any number of custom fallback fonts.
- **Priority Management:** Drag to reorder fonts in the stack to control the fallback cascade priority.
- **System Fonts:** Automatically handles standard system fallbacks if custom fonts aren't provided.

### 2. Multi-Language Simulation
- **Instant Preview:** View your type stack across **15+ locales** simultaneously, including:
  - **Latin:** English, Lithuanian, Vietnamese
  - **Scripts:** Greek, Cyrillic (Russian)
  - **RTL:** Arabic, Persian
  - **Indic:** Hindi, Bengali, Kannada, Telugu, Tamil, etc.
  - **East Asian:** Chinese (Simp/Trad), Japanese, Korean, Thai
- **Per-Character Inspection:** See exactly which font is rendering every single character.

### 3. Granular Typography Controls
Localize Type offers three levels of control to handle every edge case:

*   **Global Level:** Set the baseline weight, size (REM/PX), line-height, and letter-spacing for the entire project.
*   **Font Level:** Adjust a specific fallback font to match your brand font.
    *   *Example:* "Roboto looks 10% smaller than my custom font, so I'll scale it up by 110%."
*   **Language Level:** Override settings for a specific locale.
    *   *Example:* "Thai needs 150% line-height to avoid clipping, but English is fine at 120%."

### 4. Advanced Visualization Tools
- **Color-Coded Fallbacks:** Toggle color highlighting to instantly see which font is rendering which part of the text.
- **Visual Alignment Guides:** Overlay metric lines (Baseline, x-Height, Cap-Height, Ascender, Descender) to verify vertical alignment between different fonts.
- **Browser Render Inspection:** Verify line-box behavior to prevent unexpected layout shifts.

### 5. Production Workflow
- **Export to CSS:** Generate clean, production-ready CSS code including `@font-face` definitions and your tuned `adjust-font-size` settings.
- **Save Configuration:** Export your entire workspace state to a JSON file (versioned and backward-compatible) to share with teammates or resume work later.

---

## How to Use

### Step 1: Upload Your Fonts
Drag your primary "Brand Font" into the sidebar. Then, add any custom fallback fonts you want to test (e.g., Noto Sans for coverage).

### Step 2: Select Languages
Use the **Languages** menu to toggle the visibility of relevant locales for your project.

### Step 3: Tune Global Styles
Set your baseline values in the sidebar:
- **Base Size:** Default is 16px (1rem), but you can adjust this to see how it scales.
- **Weight & Line Height:** Set these to your brand guidelines.

### Step 4: Normalize Fallback Fonts
If a fallback font looks visually smaller or lighter than your primary font:
1.  Click on the fallback font in the sidebar.
2.  Adjust **Scale %** until the x-height matches your primary font.
3.  Override **Weight** if the fallback looks too bold or thin.

### Step 5: Handle Language Specifics
If a specific language (like Arabic or Thai) still looks wrong:
1.  Go to that language's card in the main view.
2.  Use the **Override** dropdown to force a specific font for just this language.
3.  Click **Edit** to paste real production content to verify fixes.

### Step 6: Export
Click **Export CSS** in the sidebar to get the code.

---

## Development

This project is built with:
- **React 19**
- **Vite 7**
- **TailwindCSS 4**
- **OpenType.js** (for deep font parsing and metrics)

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production
```bash
npm run build
npm run preview
```

## License
MIT
