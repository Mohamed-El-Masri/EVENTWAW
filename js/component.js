// header
document.getElementById('header').innerHTML = `  <div class="container position-relative d-flex align-items-center justify-content-between">
    
          <a href="home.html" class="logo d-flex align-items-center me-auto me-xl-0">
            <!-- Uncomment the line below if you also wish to use an image logo -->
            <!-- <img src="assets/img/logo.png" alt=""> -->
            <h1 class="sitename">EVENTWAW</h1><span>.</span>
          </a>
    
          <nav id="navmenu" class="navmenu navbar">
            <ul class="links">
              <li><a href="./home.html">Home</a></li>
              <li><a href="./Events.html">Events</a></li>
              <li><a href="./Event-details.html">Event</a></li>
              <li><a href="./about.html">About</a></li>
              <li><a href="./contact.html">Contact</a></li>
              <li><a class="btn-addEvent me-3 " href="#">Add Event</a></li>
              <li>
                <div class="search-bar">
                  <i class="fas fa-search"></i>
                  <input type="text" placeholder="Search for events...">
                </div>
              </li>
    
            </ul>
    
            <i class="mobile-nav-toggle d-xl-none bi bi-list"></i>
          </nav>
          <div class="register-login-logut-profile ">
    
            <span class="cartIcon" onclick="toggleCart()"><a href="#"><i class="fas fa-shopping-cart"></i></a></span>
    
            <li class="get-Started">
              <a href="#"><i class="fas fa-sign-in-alt"></i> <span>Login</span></a>
            </li>
    
            <div class="avatar">
              <img src="../img/download.png" alt="User Avatar">
            </div>
    
            <ul>
              <li class="profileBtn"><a href="#"><i class="fas fa-user"></i> Profile</a></li>
              <li class="logoutBtn"><a href="#"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
            </ul>
          </div>
    
    
        </div>`;

// footer
document.getElementById('footer').innerHTML = `<div class="container footer-top">
      <div class="row gy-4">
        <div class="col-lg-5 col-md-12 footer-about">
          <a href="home.html" class="logo d-flex align-items-center">
            <span class="sitename">EVENTWAW</span>
          </a>
          <p>Join us to discover and book the best events in EVENTWAW. From music festivals to art exhibitions, we have
            something for everyone. Stay updated and never miss out on the fun!</p>
          <div class="social-links d-flex mt-4">
            <a href=""><i class="bi bi-twitter-x"></i></a>
            <a href=""><i class="bi bi-facebook"></i></a>
            <a href=""><i class="bi bi-instagram"></i></a>
            <a href=""><i class="bi bi-linkedin"></i></a>
          </div>
        </div>

        <div class="col-lg-2 col-6 footer-links">
          <h4>Useful Links</h4>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About us</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Terms of service</a></li>
            <li><a href="#">Privacy policy</a></li>
          </ul>
        </div>

        <div class="col-lg-2 col-6 footer-links">
          <h4>Our Services</h4>
          <ul>
            <li><a href="#">Web Design</a></li>
            <li><a href="#">Web Development</a></li>
            <li><a href="#">Product Management</a></li>
            <li><a href="#">Marketing</a></li>
            <li><a href="#">Graphic Design</a></li>
          </ul>
        </div>

        <div class="col-lg-3 col-md-12 footer-contact text-center text-md-start">
          <h4>Contact Us</h4>
          <p>A108 Adam Street</p>
          <p>New York, NY 535022</p>
          <p>United States</p>
          <p class="mt-4"><strong>Phone:</strong> <span>+1 5589 55488 55</span></p>
          <p><strong>Email:</strong> <span>info@example.com</span></p>
        </div>

      </div>
    </div>

    <div class="container copyright text-center mt-4">
      <p>© <span>Copyright</span> <strong class="sitename">EVENTWAW</strong> <span>All Rights Reserved</span></p>
      <div class="credits">

      </div>
    </div>
`;


// Get started 
document.getElementById('getStartPopup').innerHTML = ` <span class="close-btn material-symbols-rounded">close</span>
    <div class="form-box login">
      <div class="form-details">
        <h2>Welcome Back</h2>
        <p>Please log in using your personal information to stay connected with us.</p>
      </div>
      <div class="form-content">
        <h2>LOGIN</h2>
        <form action="#">
          <div class="input-field">
            <input type="text" required>
            <label>Email</label>
          </div>
          <div class="input-field">
            <input type="password" required>
            <label>Password</label>
          </div>
          <a href="#" class="forgot-pass-link">Forgot password?</a>
          <button type="submit">Log In</button>
        </form>
        <div class="bottom-link">
          Don't have an account?
          <a href="#" id="signup-link">Signup</a>
        </div>
      </div>
    </div>
    <div class="form-box signup">
      <div class="form-details">
        <h2>Create Account</h2>
        <p>To become a part of our community, please sign up using your personal information.</p>
      </div>
      <div class="form-content">
        <h2>SIGNUP</h2>
        <form action="#">
          <div class="input-field">
            <input type="text" required>
            <label>Enter your email</label>
          </div>
          <div class="input-field">
            <input type="password" required>
            <label>Create password</label>
          </div>
          <div class="policy-text">
            <input type="checkbox" id="policy">
            <label for="policy">
              I agree the
              <a href="#" class="option">Terms & Conditions</a>
            </label>
          </div>
          <button type="submit">Sign Up</button>
        </form>
        <div class="bottom-link">
          Already have an account?
          <a href="#" id="login-link">Login</a>
        </div>
      </div>
    </div>`;

