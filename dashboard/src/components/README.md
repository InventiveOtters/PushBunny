# 🧩 Dashboard Components

## NotificationShowcase

Interactive component that demonstrates PushBunny's AI variant generation with a slot-machine animation effect.

### Features

- **iPhone Mockup**: Realistic phone design with gradient screen
- **Floating Notification**: Glass-morphism notification card
- **Slot Machine Animation**: Words rotate vertically like a slot machine
- **Multiple Variants**: Cycles through 4 different notification variants
- **Progress Indicators**: Shows which variant is currently active
- **Responsive Design**: Adapts to mobile and desktop screens

### Animation Details

1. **Word Rotation**: Each word slides up/down with staggered timing
2. **Auto-cycling**: Changes variant every 4 seconds
3. **Smooth Transitions**: Uses Framer Motion for fluid animations
4. **Visual Feedback**: Progress dots indicate current variant

### Usage

```jsx
import NotificationShowcase from '../components/NotificationShowcase'

<NotificationShowcase />
```

### Customization

Edit `NotificationShowcase.jsx` to:
- Add more notification variants
- Adjust animation timing
- Change colors and styling
- Modify phone mockup design

### Variants Structure

```javascript
{
  title: ['Word1', 'Word2'],       // Title words
  message: ['Word1', 'Word2', ...] // Message words
}
```

Each word animates independently with a staggered delay for the slot machine effect.
