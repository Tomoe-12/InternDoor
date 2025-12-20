<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUsersController extends Controller
{
    public function index(Request $request)
    {
        $page = (int) ($request->query('page', 0));
        // Laravel pages are 1-based; Spring sample used 0-based
        $pageNum = $page + 1;
        $paginator = User::orderBy('id', 'asc')->paginate(10, ['*'], 'page', $pageNum);
        return response()->json([
            'page' => $paginator->currentPage() - 1,
            'size' => $paginator->perPage(),
            'totalElements' => $paginator->total(),
            'totalPages' => $paginator->lastPage(),
            'data' => UserResource::collection($paginator->items()),
        ]);
    }
}
