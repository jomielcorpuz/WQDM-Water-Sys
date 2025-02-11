<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\DataController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SpatialController;
use App\Http\Controllers\Api\SitesController;
use App\Http\Controllers\Api\SitesStatusController;
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



Route::get('/welcome', fn () => Inertia::render('Welcome'))->name('welcome');
// Authenticated and verified routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard route
    Route::get('/dashboard', fn () => Inertia::render('Dashboard'))->name('dashboard');

    // Resource routes for DataController
    Route::resource('sitesdata', DataController::class);


    Route::resource('spatialviews', SpatialviewsController::class);

    Route::get('/batchupload', [Datacontroller::class, 'showBatchUploadForm'])->name('sitesdata.batchupload');
    Route::post('/batchupload', [DataController::class, 'handleBatchUpload'])->name('sitesdata.batchupload');
    Route::get('/sitesdata/index', [DataController::class, 'sitesExport'])
    ->name('sitesdata.export');



});



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

Route::get('/api/sitestatus', [SitesStatusController::class, 'getSiteData']);

Route::get('/test-download', function() {
    // Using public_path() helper to get the correct path
    $path = public_path('test.txt');
    return response()->download($path);
});

require __DIR__.'/auth.php';
