const DEMO_AUTH_KEY = 'demoLoggedIn';

const isDemoLoggedIn = () => localStorage.getItem(DEMO_AUTH_KEY) === 'true';

const setDemoLoggedIn = (loggedIn) => {
  if (loggedIn) {
    localStorage.setItem(DEMO_AUTH_KEY, 'true');
    return;
  }

  localStorage.removeItem(DEMO_AUTH_KEY);
};

const syncHeaderAuthState = () => {
  const loggedIn = isDemoLoggedIn();
  const loginButtons = document.querySelectorAll('[data-auth="login"]');
  const startButtons = document.querySelectorAll('[data-auth="start"]');
  const profileIcons = document.querySelectorAll('[data-auth="profile"]');

  loginButtons.forEach((element) => {
    element.classList.toggle('is-hidden', loggedIn);
  });

  startButtons.forEach((element) => {
    element.classList.toggle('is-hidden', loggedIn);
  });

  profileIcons.forEach((element) => {
    element.classList.toggle('is-hidden', !loggedIn);
  });
};

const bindAuthEvents = () => {
  const loginButtons = document.querySelectorAll('[data-auth="login"]');
  const logoutButton = document.querySelector('[data-auth="logout"]');

  loginButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      setDemoLoggedIn(true);
      window.location.href = 'profil.html';
    });
  });

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      setDemoLoggedIn(false);
      window.location.href = 'index.html';
    });
  }
};

syncHeaderAuthState();
bindAuthEvents();
