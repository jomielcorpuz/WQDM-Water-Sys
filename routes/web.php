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
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
    ]);
});

Route::get('/welcome', fn () => Inertia::render('Welcome'))->name('welcome');
// Authenticated and verified routes
Route::middleware(['auth', 'verified'])->group(function () {

    //API
    Route::get('/api/sitestatus', [SitesStatusController::class, 'getSiteData']);

    // Dashboard route
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Resource routes for DataController
    Route::resource('sitesdata', DataController::class);

    Route::resource('spatialviews', SpatialviewsController::class);

    Route::get('/batchupload', [Datacontroller::class, 'showBatchUploadForm'])->name('sitesdata.batchupload');
    Route::post('/batchupload', [DataController::class, 'handleBatchUpload'])->name('sitesdata.batchupload');
    Route::get('/sitesdata/index', [DataController::class, 'sitesExport'])
    ->name('sitesdata.export');
});

//Public route api
Route::get('/spatial', [SitesController::class, 'spatialPage'])->name('spatial.page');
Route::middleware('throttle:60,1')->get('/api/spatial', [SitesController::class, 'index']);

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

//Export
Route::get('/test-download', function() {
    // Using public_path() helper to get the correct path
    $path = public_path('test.txt');
    return response()->download($path);
});

require __DIR__.'/auth.php';
