document.addEventListener("DOMContentLoaded", function () {
  let clickedImages = [];
  const progressBar = document.getElementById("progress-bar");
  const images = document.querySelectorAll(".clickable-image");
  const removeProgressButton = document.getElementById("remove-progress-button");
  const chooseCounter = document.getElementById("choose-counter");
  const submitButton = document.getElementById("submit-button");

  // Functions

  // Function to fill the progress bar
  function fillProgressBar() {
    progressBar.style.width = "100%";
    progressBar.classList.add('filled');
  }

  // Function to remove the progress
  function removeProgress() {
    progressBar.style.width = "0%";
    progressBar.classList.remove('filled');
    clickedImages = [];
    updateChooseCounter();
    resetImageStyles();
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

    if (clickedImages.length >= 3) {
        // Enable submit button to proceed
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
}


  // Function to update progress bar
  function updateProgressBar() {
    const progressPercentage = (clickedImages.length / images.length) * 100;
    progressBar.style.width = progressPercentage + "%";
  }

  // Function to handle submission
  function handleSubmit() {
    if (clickedImages.length >= 3) {
      fetch('/ClickedImagesSDG', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clickedImages }),
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
  submitButton.addEventListener("click", handleSubmit);
});
