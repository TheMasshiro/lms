export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize : {
        'course-details-heading-small' : ['26px', '36px'],
        'course-details-heading-large' : ['36px', '44px'],
        'home-heading-small' : ['28px', '34px'],
        'home-heading-large' : ['48px', '56px'],
        'default' : ['15px', '21px']
      },
      gridTemplateColumns : {
        'auto' : 'repeat(auto-fit, minmax(200px, 1fr))'
      },
      spacing:{
        'section-height' : '500px'
      },

      maxWidth: {
        'course-card': '420px',
      },
      boxShadow: {
        'custome-card': '0px  4px 15px  2px rgba(0, 0, 0, 0.1)',
      },

      
      borderRadius: {
        'liquid': '50px',
        'liquid-hover': '10px',
      },
      rotate: {
        'liquid': '15deg',
      },
      animation: {
        'liquid-morph': 'morph 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        morph: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(2)', opacity: '0.5' },
        }
      },
      backgroundImage: {
        'liquid-gradient': 'conic-gradient(#0ff 0deg, #0a2342 120deg, #0ff 240deg)',
      }
    },
  },
  plugins: [],
}

