document.addEventListener("DOMContentLoaded", function () {
  let clickedImages = [];
  const progressBar = document.getElementById("progress-bar");
  const images = document.querySelectorAll(".clickable-image");
  const removeProgressButton = document.getElementById("remove-progress-button");
  const chooseCounter = document.getElementById("choose-counter");
  const submitButton = document.getElementById("submit-button");

  // Function to remove the progress
  function removeProgress() {
    progressBar.style.width = "0%";
    progressBar.classList.remove('filled'); // Remove 'filled' class
    clickedImages = [];
    updateChooseCounter();
    resetImageStyles();
  }

  function fillProgressBar() {
    progressBar.classList.add('filled'); // Add 'filled' class
  }

  function resetImageStyles() {
    images.forEach(image => {
      image.classList.remove('selected');
    });
  }

  // Function to handle image clicks
  function handleImageClick(index) {
    const isSelected = images[index].classList.contains('selected');

    if (isSelected) {
      // Deselect the image
      images[index].classList.remove('selected');
      clickedImages = clickedImages.filter(clickedIndex => clickedIndex !== index);
    } else {
      // Select the image
      images[index].classList.add('selected');
      clickedImages.push(index);
    }

    updateProgressBar();
    updateChooseCounter();
    updateSubmitButtonState(); // Update submit button state
  }

  // Function to update progress bar
  function updateProgressBar() {
    const progressPercentage = (clickedImages.length / images.length) * 100;
    progressBar.style.width = progressPercentage + "%";

    if (progressPercentage === 0) {
      progressBar.classList.remove('filled');
    } else {
      fillProgressBar(); // Fill progress bar if there's progress
    }
  }

  // Function to update submit button state
  function updateSubmitButtonState() {
    submitButton.disabled = clickedImages.length < 3;
  }

  // Function to handle submission
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
    }
  }

  removeProgressButton.addEventListener("click", removeProgress);
  

  // Attach image click handlers
  images.forEach((image, index) => {
    image.addEventListener("click", function () {
      handleImageClick(index);
    });
  });

  // Add an event listener to the submit button
  submitButton.addEventListener("click", function(event) {
    handleSubmit(event);
  });
});