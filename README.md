

<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Rod10/Club-Lgc">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Timing Management</h3>

  <p align="center">
    A little web site for managing timing session in the world of rc model
    <br />
    <a href="https://github.com/Rod10/Club-Lgc"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Rod10/Club-Lgc">View Demo</a>
    ·
    <a href="https://github.com/Rod10/Club-Lgc/issues">Report Bug</a>
    ·
    <a href="https://github.com/Rod10/Club-Lgc/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project
![Main Page](https://cdn.discordapp.com/attachments/1212680670376370217/1212701834473504768/image.png?ex=65f2cb98&is=65e05698&hm=b523c99981f45c6466d9cf2a44724688027269296b294ecbd7057724a7692403&)
This is a website for managing track and timing session for a RC model club. You can add track with some info's and save session with the track selected. 
You'll have all the past session at click and immediately check if you're improving or not.
For now it's focused on track like RCP or Kyosho tracks with slabs.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* ![Static Badge](https://img.shields.io/badge/NodeJs-%23FFFFFF?style=for-the-badge&logo=nodedotjs)
* ![Static Badge](https://img.shields.io/badge/Express-%23000000?style=for-the-badge&logo=express)


* [![React][React.js]][React-url]
* ![Static Badge](https://img.shields.io/badge/Sequelize-%23FFFFFF?style=for-the-badge&logo=sequelize)

* ![Static Badge](https://img.shields.io/badge/MySql-%23FFFFFF?style=for-the-badge&logo=mysql)
<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started
### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* NodeJs
* MySql

### Installation

1. Clone the repo:
   ```sh
   git clone https://github.com/Rod10/Club-Lgc.git
   ```
2. Install NPM packages:
   ```sh
   npm install
   ```
3. Create a Database
4. Add credential of your database in ```config.json``` and your club name
5. Run migrations for your database with:
	```
	npx sequelize-cli bd:migrate
	```
6. If you have no error you can now start the website with:
	```
	npm start
	```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

First thing you'll need to do is to create a track, for this you can just click on the `voir les pistes` text on the left and on the `Nouvelle Piste` button.
Enter the number of tiles that make up your track.
Below the `Plan de la piste` you can insert a track map that you have created in ZRound designer (for exemple).
And that its you can now Validate.
The track will appear in your list.
For session it's easier, click on the `Liste des sessions` on the left click on the button `Nouvelle session`.
Select your track in the select the track map will appear on the right for making it easier and add the export file of your session.
***Note**: for now it's work only with U-Count export, i know that an old software but don't worry i will made other software import available.*

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [ ] Add a language selector
- [ ] Add possibilities to select an timing software when importing result

See the [open issues](https://github.com/Rod10/Club-Lgc/issues) for a full list of proposed features (and known issues). You're free to propose feature

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Erwan Billy - [@Rod2448](https://twitter.com/Rod2448) - erwan.billy@hotmail.fr

Project Link: [https://github.com/Rod10/Club-Lgc](https://github.com/Rod10/Club-Lgc)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/github_username/repo_name/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/repo_name/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo_name/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo_name/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/github_username/repo_name/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
