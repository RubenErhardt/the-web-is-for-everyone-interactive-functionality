document.addEventListener("DOMContentLoaded", function () {
  let clickedImages = [];
  const progressBar = document.getElementById("progress-bar");
  const images = document.querySelectorAll(".clickable-image");
  const removeProgressButton = document.getElementById("remove-progress-button");
  const submitButton = document.getElementById("submit-button");
  const sdgPagina = document.querySelector(".SDG-pagina");
  const naarDeSDGKnop = document.querySelector(".stakeholder-btn");

  

  // Functie om de voortgangsbalk bij te werken
  function updateProgressBar() {
    const progressPercentage = (clickedImages.length / images.length) * 100;
    progressBar.style.width = progressPercentage + "%";

    if (progressPercentage === 0) {
      progressBar.classList.remove('filled');
    } else {
      progressBar.classList.add('filled');
    }
  }

  // Functie om met afbeeldingsklikken om te gaan
  function handleImageClick(index) {
    const isSelected = images[index].classList.contains('selected');

    if (isSelected) {
      images[index].classList.remove('selected');
      clickedImages = clickedImages.filter(clickedIndex => clickedIndex !== index);
    } else {
      images[index].classList.add('selected');
      clickedImages.push(index);
    }

    updateProgressBar();
    updateSubmitButtonState();
  }

  // Functie om de staat van de submit knop bij te werken
  function updateSubmitButtonState() {
    if (clickedImages.length >= 3) {
      submitButton.removeAttribute('disabled');
    } else {
      submitButton.setAttribute('disabled', 'disabled');
    }
  }

  // Functie om het indienen af te handelen
  function handleSubmit(event) {
    event.preventDefault();

    if (clickedImages.length >= 3) {
      fetch('/ClickedImagesSDG', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clickedImages
          }),
        })
        .then(response => response.json())
        .then(data => {
          window.location.href = "vragenlijst";
        })
    } else {
      alert("Selecteer minstens drie afbeeldingen.");
    }
  }

  // Voeg event listeners toe aan klikbare afbeeldingen
  images.forEach((image, index) => {
    image.addEventListener("click", function () {
      handleImageClick(index);
    });
    
    image.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        handleImageClick(index);
      }
    });
  });

  // Voeg event listener toe aan de knop om de voortgang te verwijderen
  removeProgressButton.addEventListener("click", function() {
    clickedImages = [];
    images.forEach(image => {
      image.classList.remove('selected');
    });
    updateProgressBar();
    updateSubmitButtonState();
  });

  // Voeg event listener toe aan de submit knop
  submitButton.addEventListener("click", function(event) {
    handleSubmit(event);
  });

  // Functie voor soepel scrollen naar het tweede deel van de HTML
  function scrollToSDGPagina() {
    sdgPagina.scrollIntoView({ behavior: "smooth" });
    document.body.style.overflow = "auto"; // Herstel het scrollen
    naarDeSDGKnop.style.display = "none"; // Verberg de knop
  }

  naarDeSDGKnop.addEventListener("click", scrollToSDGPagina);

  // Voorkom scrollen totdat er op de knop wordt geklikt
  document.body.style.overflow = "hidden";
});
