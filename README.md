# Four-Frame 🎬

A beautiful, modern movie discovery web application with a feminine design aesthetic. Browse trending movies, search for your favorites, and watch trailers in an elegant modal interface.

## ✨ Features

- **Movie Discovery**: Browse trending movies and TV shows
- **Search Functionality**: Find movies by title with real-time search
- **Category Filtering**: Filter by movies, TV shows, and animation
- **Trailer Viewing**: Watch YouTube trailers in beautiful modals
- **User Authentication**: Secure login and registration system
- **Profile Management**: Update email and profile pictures
- **Responsive Design**: Works perfectly on desktop and mobile
- **Modern UI**: Glassmorphism design with pink/purple gradients

## 🎨 Design

- **Glassmorphism Effects**: Frosted glass UI elements with backdrop blur
- **Gradient Backgrounds**: Beautiful pink and purple color schemes
- **Smooth Animations**: Hover effects and transitions throughout
- **Movie-Themed**: Cinema backgrounds and movie camera icons
- **Typography**: Elegant Playfair Display and Inter font combination

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Formik & Yup** - Form handling and validation
- **CSS3** - Advanced styling with gradients and animations

### APIs
- **TMDB API** - Movie data and trailers
- **Custom Backend** - User authentication and profiles

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- TMDB API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/four-frame.git
cd four-frame
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env file (optional - TMDB key is included)
REACT_APP_TMDB_API_KEY=your_tmdb_api_key_here
```

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Usage

1. **Browse Movies**: Click "Trending" to see popular movies
2. **Search**: Use the search bar to find specific movies
3. **Filter**: Use category buttons to filter by type
4. **Watch Trailers**: Click any movie card to open trailer modal
5. **Register/Login**: Create an account to access profile features
6. **Profile**: Update your email and profile picture

## 🎯 Project Structure

```
four-frame/
├── public/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Profile.jsx
│   │   ├── Navbar.jsx
│   │   ├── MovieCard.jsx
│   │   ├── MovieContainer.jsx
│   │   ├── MovieDetail.jsx
│   │   └── SearchBar.jsx
│   ├── App.jsx
│   ├── style.css
│   └── index.js
├── package.json
└── README.md
```

## 🔧 Configuration

### Backend Integration
The app expects a backend API running on port 9000 with these endpoints:
- `POST /api/register` - User registration
- `POST /api/login` - User authentication
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### TMDB API
Get your free API key from [The Movie Database](https://www.themoviedb.org/settings/api)

## 🎨 Customization

### Colors
Main color scheme defined in `style.css`:
- Primary: `#ff9a9e` (Pink)
- Secondary: `#fecfef` (Light Pink)
- Accent: `#667eea` (Purple)

### Fonts
- Headers: Playfair Display (serif)
- Body: Inter (sans-serif)

## 📦 Build

Create a production build:
```bash
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License 

## 👨‍💻 Author

**Kibor Kisabit**

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for movie data
- [Unsplash](https://unsplash.com/) for background images
- [Google Fonts](https://fonts.google.com/) for typography
- React community for excellent documentation

---

Made with 💜 by Kibor Kisabit# Four-Frame
