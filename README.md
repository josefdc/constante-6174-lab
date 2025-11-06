# Kaprekar's Constant: 6174 ✨

An interactive web visualization of Kaprekar's constant - a fascinating mathematical phenomenon where any 4-digit number (with non-identical digits) converges to 6174 through a simple iterative process.

![Kaprekar's Constant Demo](https://img.shields.io/badge/status-live-brightgreen)

## 🎯 What is Kaprekar's Constant?

Named after Indian mathematician D.R. Kaprekar (1905–1986), this constant demonstrates a remarkable property:

1. Take any 4-digit number (digits not all the same)
2. Arrange digits in descending order (largest number)
3. Arrange digits in ascending order (smallest number)
4. Subtract the smaller from the larger
5. Repeat with the result

**You will always reach 6174!**

## 🚀 Features

- ✨ **Interactive Input** - Enter your own number or generate random ones
- 🎬 **Step-by-step Animation** - Watch each iteration with smooth CSS animations
- 🎮 **Playback Controls** - Play, pause, and navigate through steps
- 📊 **Visual Timeline** - See the entire convergence path at a glance
- 🎯 **Convergence Detection** - Special celebration when reaching 6174
- 📱 **Responsive Design** - Works beautifully on all devices

## 🛠️ Tech Stack

- **React** - Component-based UI architecture
- **Vite** - Fast build tool and dev server
- **CSS3** - Modern animations and gradients
- **JavaScript** - Core algorithm implementation

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/constante-6174-lab.git

# Navigate to project directory
cd constante-6174-lab

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🎮 Usage

1. Open http://localhost:5173/ in your browser
2. Enter a 4-digit number or click 🎲 to generate a random one
3. Click "Start" to begin the visualization
4. Use the controls to navigate through steps or watch the animation

## 📂 Project Structure

```
constante-6174-lab/
├── src/
│   ├── components/
│   │   ├── InputPanel.jsx          # User input and controls
│   │   ├── KaprekarVisualizer.jsx  # Main visualization container
│   │   └── StepDisplay.jsx         # Individual step rendering
│   ├── utils/
│   │   └── kaprekar.js             # Core algorithm
│   ├── App.jsx                     # Main application component
│   └── main.jsx                    # Entry point
├── public/
├── index.html
└── package.json
```

## 🎨 Design Decisions

We chose **React + Vite** (Solution 1 from the design doc) for:
- Mature ecosystem with excellent developer experience
- Component reusability and clean state management
- Fast HMR for rapid iteration
- Pure CSS animations for lightweight bundle size

See [desingdoc.md](./desingdoc.md) for detailed design rationale.

## 🧪 Examples

Try these interesting numbers:
- `3524` - Converges in 3 steps
- `1000` - Converges in 5 steps
- `9998` - Converges in 5 steps
- `6174` - Already at the constant!

## 📚 Learn More

- [Kaprekar's Constant on Wikipedia](https://en.wikipedia.org/wiki/6174_(number))
- [Numberphile Video](https://www.youtube.com/watch?v=d8TRcZklX_Q)

## 📄 License

MIT License - feel free to use this project for educational purposes!

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

Made with ❤️ using React and Vite
