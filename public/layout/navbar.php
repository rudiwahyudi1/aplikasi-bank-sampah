  <body>
  <div class="container-scroller">
    <!-- partial:partials/_navbar.html -->
    <nav class="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
      <div class="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center" style="background-color:  #3c3c51">
         <a href="home.php?page=home" class="navbar-brand brand-logo text-white">Admin | SJA</a>
        <a class="navbar-brand brand-logo-mini" href="index.html"><img src="images/logo-mini.svg" alt="logo"/></a>
      </div>
      <div class="navbar-menu-wrapper d-flex align-items-center justify-content-end">
        <button class="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
          <span class="icon-menu"></span>
        </button>
        <ul class="navbar-nav mr-lg-2">
          <li class="nav-item nav-search d-none d-lg-block">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="search">
                  <i class="icon-search"></i>
                </span>
              </div>
              <input type="text" class="form-control" placeholder="Search Projects.." aria-label="search" aria-describedby="search">
            </div>
          </li>
        </ul>
        <ul class="navbar-nav navbar-nav-right">
          <li class="nav-item dropdown d-flex">
            <a class="nav-link count-indicator dropdown-toggle d-flex justify-content-center align-items-center" id="messageDropdown" href="#" data-toggle="dropdown">
              <i class="icon-air-play mx-0"></i>
            </a>
            <div class="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="messageDropdown">
              <p class="mb-0 font-weight-normal float-left dropdown-header">Messages</p>
              <a class="dropdown-item preview-item">
                <div class="preview-thumbnail">
                    <img src="images/faces/face4.jpg" alt="image" class="profile-pic">
                </div>
                <div class="preview-item-content flex-grow">
                  <h6 class="preview-subject ellipsis font-weight-normal">David Grey
                  </h6>
                  <p class="font-weight-light small-text text-muted mb-0">
                    The meeting is cancelled
                  </p>
                </div>
              </a>
              <a class="dropdown-item preview-item">
                <div class="preview-thumbnail">
                    <img src="images/faces/face2.jpg" alt="image" class="profile-pic">
                </div>
                <div class="preview-item-content flex-grow">
                  <h6 class="preview-subject ellipsis font-weight-normal">Tim Cook
                  </h6>
                  <p class="font-weight-light small-text text-muted mb-0">
                    New product launch
                  </p>
                </div>
              </a>
              <a class="dropdown-item preview-item">
                <div class="preview-thumbnail">
                    <img src="images/faces/face3.jpg" alt="image" class="profile-pic">
                </div>
                <div class="preview-item-content flex-grow">
                  <h6 class="preview-subject ellipsis font-weight-normal"> Johnson
                  </h6>
                  <p class="font-weight-light small-text text-muted mb-0">
                    Upcoming board meeting
                  </p>
                </div>
              </a>
            </div>
          </li>
          <li class="nav-item dropdown d-flex mr-4 ">
            <a class="nav-link count-indicator dropdown-toggle d-flex align-items-center justify-content-center" id="notificationDropdown" href="#" data-toggle="dropdown">
              <i class="icon-cog"></i>
            </a>
            <div class="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="notificationDropdown">
              <p class="mb-0 font-weight-normal float-left dropdown-header">Settings</p>
              <a class="dropdown-item preview-item">               
                  <i class="icon-head"></i> Profile
              </a>
              <a href="login.php" class="dropdown-item preview-item">
                  <i class="icon-inbox"></i> Logout
              </a>
            </div>
          </li>
         
        </ul>
        <button class="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
          <span class="icon-menu"></span>
        </button>
      </div>
    </nav>
    <!-- partial -->
    <div class="container-fluid page-body-wrapper">
      <!-- partial:partials/_sidebar.html -->
      <nav class="sidebar sidebar-offcanvas" id="sidebar" style="background-color:  #3c3c51">
        <div class="user-profile">
          <div class="user-image">
            <img src="images/logo-sja.png">
          </div>
          <div class="user-name">
              Senang Jaya
          </div>
          <div class="user-designation">
              Abadi
          </div>
        </div>
        <ul class="nav">
          <li class="nav-item">
            <a class="nav-link" href="home.php?halaman=home">
              <i class="icon-box menu-icon"></i>
              <span class="menu-title">Dashboard</span>
            </a>
          </li>
          
          <!-- Manajemen Produksi Start -->
          <li class="nav-item">
            <a class="nav-link text-white collapsed" data-bs-toggle="collapse" href="#Manajemen_Produksi" aria-expanded="false" aria-controls="Manajemen_Produksi">
              <i class="icon-disc me-2"></i> 
               <span class="menu-title">Manaj. Produksi</span>
              <i class="menu-arrow"></i>
            </a>
            <div class="collapse" id="Manajemen_Produksi">
              <ul class="nav flex-column ms-3">
               <li class="nav-item">
                <a class="nav-link text-white-50" href="home.php?halaman=daftar-unit">
                  <i class="bi bi-truck me-2"></i> Data Produksi
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link text-white-50" href="home.php?halaman=riwayat-produksi">
                  <i class="bi bi-clock-history me-2"></i> Riwayat Produksi
                </a>
              </li>
              </ul>
            </div>
          </li>
         <!-- Manajemen Produksi End -->

         <!-- Tahap Produksi Start -->
         <li class="nav-item">
           <a class="nav-link text-white collapsed" data-bs-toggle="collapse" href="#Tahap_Produksi" aria-expanded="false" aria-controls="Tahap_Produksi">
              <i class="icon-command me-2"></i> 
               <span class="menu-title">Tahap Produksi</span>
              <i class="menu-arrow"></i>
            </a>
            <div class="collapse" id="Tahap_Produksi">
              <ul class="nav flex-column ms-3">
               <li class="nav-item">
                <a class="nav-link text-white-50" href="home.php?page=perakitan">
                  <i class="bi bi-gear-fill me-2"></i> Perakitan
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link text-white-50" href="home.php?page=pengecetan">
                  <i class="bi bi-paint-bucket me-2"></i> Pengecetan
                </a>
              </li>  <li class="nav-item">
                <a class="nav-link text-white-50" href="home.php?page=finishing">
                  <i class="bi bi-brush-fill me-2"></i> Finishing
                </a>
              </li>
                <li class="nav-item">
                <a class="nav-link text-white-50" href="home.php?page=Qc">
                  <i class="bi bi-shield-check me-2"></i> Quality Controls
                </a>
              </li>
                <li class="nav-item">
                <a class="nav-link text-white-50" href="home.php?page=riwayat-pengiriman">
                  <i class="bi bi-truck me-2"></i> Pengiriman
                </a>
              </li>
              </ul>
            </div>
          </li>
         <!-- Tahap Produksi End -->

          <li class="nav-item">
            <a class="nav-link" href="docs/documentation.html">
              <i class="icon-book menu-icon"></i>
              <span class="menu-title">Documentation</span>
            </a>
          </li>
        </ul>
      </nav>