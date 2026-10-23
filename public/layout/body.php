      <!-- partial -->
      <div class="main-panel">
        <div class="content-wrapper">
          <div class="row">
            <div class="col-sm-12 mb-4 mb-xl-0">
              <h4 class="font-weight-bold text-dark">Dashboard Produksi Karoseri</h4>
              <p class="font-weight-normal mb-2 text-muted">22 Juli 2025</p>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-xl-3 flex-column d-flex grid-margin stretch-card">
              <div class="row flex-grow">
                <div class="col-sm-12 grid-margin stretch-card">
                    <div class="card">
                      <div class="card-body">
                          <h4 class="card-title">Total Unit</h4>
                          <p>Total seluruh unit yang masuk ke jalur produksi</p>
                          <h4 class="text-dark font-weight-bold mb-2">125 Unit</h4>
                          <canvas id="customers"></canvas>
                      </div>
                    </div>
                </div>
                <div class="col-sm-12 stretch-card">
                    <div class="card">
                      <div class="card-body">
                           <h4 class="card-title">Dalam Produksi</h4>
                           <p>Unit yang sedang dalam proses karoseri</p>
                           <h4 class="text-dark font-weight-bold mb-2">70 Unit</h4>
                          <canvas id="orders"></canvas>
                      </div>
                    </div>
               </div>
              </div>
            </div>
            <!-- Laporan Produksi Harian -->
            <div class="col-xl-9 d-flex grid-margin stretch-card">
              <div class="card">
                <div class="card-body">
                  <h4 class="card-title">Laporan Produksi Harian</h4>
                    <div class="row">
                      <div class="col-lg-5">
                        <p>Rekap unit harian berdasarkan progres produksi.</p>
                      </div>
                      </div>
                      <div class="row">
                          <div class="col-sm-12">
                              <canvas id="web-audience-metrics-satacked" class="mt-3"></canvas>
                          </div>
                      </div>
                        
                    </div>
                  </div>
            </div>
          </div>
        
          <!-- Produksi Detail -->
            <div class="row">
              <!-- Tahap Produksi -->
                <div class="col-xl-4 grid-margin stretch-card">
                  <div class="card">
                    <div class="card-body">
                      <div class="d-flex justify-content-between mb-3">
                        <h4 class="card-title">Tahap Produksi</h4>
                        <div class="dropdown">
                          <button class="btn btn-sm dropdown-toggle text-dark pt-0 pr-0" type="button" data-toggle="dropdown">
                            Minggu Ini
                          </button>
                          <div class="dropdown-menu">
                            <h6 class="dropdown-header">Minggu Ini</h6>
                            <h6 class="dropdown-header">Bulan Ini</h6>
                          </div>
                        </div>
                      </div>
                      <div class="row mt-2 mb-2">
                        <div class="col-6">
                          <div class="text-small"><span class="text-success">18 unit</span> ke tahap akhir</div>
                        </div>
                        <div class="col-6">
                          <div class="text-small"><span class="text-warning">7 unit</span> tertunda</div>
                        </div>
                      </div>
                      <div class="marketTrends mt-4">
                        <canvas id="marketTrendssatacked"></canvas>
                      </div>   
                    </div>
                  </div>
              </div>
              <!-- Status Produksi -->
              <div class="col-xl-4 grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <h4 class="card-title">Status Produksi</h4>
                    <div class="row">
                      <div class="col-sm-12">
                        <div class="d-flex justify-content-between mt-2 text-dark mb-2">
                          <div><span class="font-weight-bold">125</span> Unit</div>
                          <div>Target: 150</div>
                        </div>
                        <div class="progress progress-md grouped mb-2">
                          <div class="progress-bar bg-success" style="width: 25%">25%</div>
                          <div class="progress-bar bg-warning" style="width: 20%">20%</div>
                          <div class="progress-bar bg-info" style="width: 15%">15%</div>
                          <div class="progress-bar bg-primary" style="width: 10%">10%</div>
                          <div class="progress-bar bg-secondary" style="width: 30%">30%</div>
                        </div>
                      </div>
                      <div class="col-sm-12">
                        <div class="traffic-source-legend">
                          <div class="d-flex justify-content-between mb-1 mt-2">
                            <div class="font-weight-bold">TAHAP</div>
                            <div class="font-weight-bold">JUMLAH</div>
                          </div>
                          <div class="d-flex justify-content-between legend-label">
                            <div><span class="bg-success"></span>Perakitan</div>
                            <div>25%</div>
                          </div>
                          <div class="d-flex justify-content-between legend-label">
                            <div><span class="bg-warning"></span>Finishing</div>
                            <div>20%</div>
                          </div>
                          <div class="d-flex justify-content-between legend-label">
                            <div><span class="bg-info"></span>Pengecatan</div>
                            <div>15%</div>
                          </div>
                          <div class="d-flex justify-content-between legend-label">
                            <div><span class="bg-primary"></span>QC</div>
                            <div>10%</div>
                          </div>
                          <div class="d-flex justify-content-between legend-label">
                            <div><span class="bg-secondary"></span>Pengiriman</div>
                            <div>30%</div>
                          </div>
                        </div>
                      </div>
                    </div>  
                  </div>
                </div>
              </div>
          </div>
        </div>