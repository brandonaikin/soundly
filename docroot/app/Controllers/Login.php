<?php namespace App\Controllers;
ini_set('display_errors', 1);
class Login extends BaseController {
  public function index() {
    return view("login");
  }
  
  public function submit() {
    $id = $this->request->getVar('id');
    if(!empty($id)) {
      return redirect()->to("/public/home/sequencer?id=$id");
    }
    return view("login");
  }
}