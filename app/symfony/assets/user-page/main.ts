import $ from 'jquery';
import "../generic-code/generic-styling.css";
import "./css/user-page.scss";
import { UserPage } from './ts/UserPage';
$(() => {
  let userPage: UserPage = new UserPage();
});
