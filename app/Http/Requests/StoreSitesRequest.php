<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSitesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name" => ['required', 'string', 'max:255'],
            "ph_level" => ['required', 'numeric', 'between:0,14'],
            "turbidity" => ['required', 'numeric', 'min:0'],
            "total_dissolved_solids" => ['required', 'numeric', 'min:0'],
            "total_hardness" => ['required', 'numeric', 'min:0'],
            "salinity" => ['required', 'numeric', 'min:0'],
            "nitrate" => ['required', 'numeric', 'min:0'],
            "sulfate" => ['required', 'numeric', 'min:0'],
            "latitude" => ['required', 'numeric', 'between:-90,90'],
            "longitude" => ['required', 'numeric', 'between:-180,180'],
            // "status" => ['required', 'string', 'in:potable,non-potable'],
        ];
    }
}
