<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\DataController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SpatialController;
use App\Http\Controllers\Api\SitesController;
use App\Http\Controllers\BatchuploadController;
use App\Http\Controllers\SpatialviewsController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});



// Authenticated and verified routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard route
    Route::get('/dashboard', fn () => Inertia::render('Dashboard'))->name('dashboard');

    // Resource routes for DataController
    Route::resource('sitesdata', DataController::class);

    //Route::delete('/sitesdata/{sites}', [DataController::class, 'destroy'])->name('sitesdata.destroy');


    // Route::get('/spatialviews/viewspatial', [SpatialviewsController::class, 'spatialIndex'])
    // ->name('spatialviews.viewspatial');
    Route::resource('spatialviews', SpatialviewsController::class);

    //Route::get('/spatialviews/viewspatial', [SpatialviewsController::class, 'spatialIndex'])->name('spatial.page');

    // Batch upload route within resource
    // Route::post('/sitesdata/batchupload', [BatchuploadController::class, 'handleBatchUpload'])->name('sitesdata.batchupload');

    // Route::get('/spatialviews/viewspatial', [SpatialController::class, 'spatialIndex'])->name('sitesdata.viewspatial');
    // Route::resource('/sitesdata/viewspatial', [SpatialController::class, 'spatialIndex'])->name('sitesdata.viewspatial');


});


Route::get('/sitesdata/batchupload', [BatchuploadController::class, 'showBatchUploadForm'])->name('sitesdata.batchupload');
Route::post('/sitesdata/batchupload', [BatchuploadController::class, 'handleBatchUpload'])->name('sitesdata.batchupload');



Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Route::get('/spatial', function () {
//     return Inertia::render('Spatial');
// })->name('spatial');
// Route::get('/spatial', [SpatialController::class, 'spatial'])->name('spatial');

Route::get('/spatial', [SitesController::class, 'spatialPage'])->name('spatial.page');

Route::get('/api/spatial', [SitesController::class, 'index'])->name('api.spatial');


require __DIR__.'/auth.php';
