

# 3D Interactive Wall Calendar

A highly interactive, React-based calendar application designed with a physical "wall calendar" aesthetic. This project features advanced 3D transitions, date-range note-taking, and a responsive layout powered by Vite and Tailwind CSS.

## 🚀 Key Features

### 1. Immersive 3D Transitions
* **Wall Calendar Flip**: Implemented using `framer-motion`, the calendar mimics the physics of a physical page flip when navigating between months.
* **Perspective Engine**: Uses a `perspective-container` and `rotateX` transformations to give the UI depth and a realistic paper-turning feel.

### 2. Advanced Note-Taking & Range Selection
* **Flexible Scoping**: Users can create notes for a specific day, a custom date range, or the entire month.
* **Intelligent Date Range**: A custom `useCalendarRange` hook handles complex selection logic, allowing users to click a start and end date to highlight a range.
* **Note Customization**: Each note supports individual color coding (6 distinct palettes) and text styling (Normal, Bold, Italic).
* **Persistence**: All notes and theme preferences are saved locally using a custom `useLocalStorage` hook.

### 3. Dynamic UI & Interaction
* **Sensory Feedback**: Features spatial audio effects, including a "paper flip" sound during navigation and a "trash" sound when deleting notes.
* **Resizable Layout**: A custom-built draggable divider allows users to manually adjust the height of the notes panel.
* **Theme Support**: Full support for Light and Dark modes with smooth CSS variable transitions.
* **Keyboard Navigation**: Supports `ArrowUp` and `ArrowDown` keys for quick month-to-month flipping.

### 4. Component-Driven Architecture
* **Spiral Binder**: A decorative yet functional CSS-based component that anchors the 3D flip animation.
* **Visual Grid**: A `DayGrid` component that intelligently renders days from `date-fns` to ensure accuracy across years and leap months.

## 🛠️ Technical Stack
* **Core**: React 19, Vite
* **Styling**: Tailwind CSS 4 (with CSS variables for theming)
* **Animations**: Framer Motion
* **Date Logic**: date-fns
* **Icons**: Lucide React
* **Audio**: use-sound / Howler

## 💻 Local Development

Follow these steps to get the project running on your machine:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/VMPRANAV/FrontendChallenge-Calendar/

    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the development server**:
    ```bash
    npm run dev
    ```

4.  **Build for production**:
    ```bash
    npm run build
    ```

5.  **Lint the project**:
    ```bash
    npm run lint
    ```
