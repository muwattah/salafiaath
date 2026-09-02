// Multi-step order form for Salafiaath

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('orderForm');
  if (!form) return;
  const steps = form.querySelectorAll('.form-step');
  const progressSteps = document.querySelectorAll('.progress-step');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
  const formNav = document.getElementById('formNav');
  const formSuccess = document.getElementById('formSuccess');
  let currentStep = 1;
  const totalSteps = steps.length;
  function showStep(step) {
    steps.forEach(function (s) { s.classList.remove('active'); });
    const active = form.querySelector('.form-step[data-step="' + step + '"]');
    if (active) active.classList.add('active');
    progressSteps.forEach(function (p) {
      const pStep = parseInt(p.getAttribute('data-step'), 10);
      p.classList.remove('active', 'completed');
      if (pStep === step) p.classList.add('active');
      else if (pStep < step) p.classList.add('completed');
    });
    prevBtn.style.visibility = step === 1 ? 'hidden' : 'visible';
    if (step === totalSteps) { nextBtn.style.display = 'none'; submitBtn.style.display = 'inline-flex'; }
    else { nextBtn.style.display = 'inline-flex'; submitBtn.style.display = 'none'; }
    form.closest('.form-wrapper').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function validateStep(step) {
    const stepEl = form.querySelector('.form-step[data-step="' + step + '"]');
    if (!stepEl) return true;
    let valid = true;
    stepEl.querySelectorAll('.form-group').forEach(function (g) { g.classList.remove('error'); });
    stepEl.querySelectorAll('[required]').forEach(function (field) {
      const group = field.closest('.form-group');
      let isValid = true;
      if (field.type === 'radio') {
        isValid = !!stepEl.querySelector('input[name="' + field.name + '"]:checked');
        if (!isValid && group) group.classList.add('error');
      } else if (field.type === 'checkbox') {
        isValid = field.checked;
        if (!isValid && group) group.classList.add('error');
      } else if (field.type === 'email') {
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        if (!isValid && group) group.classList.add('error');
      } else if (field.type === 'number') {
        isValid = parseInt(field.value, 10) >= 1;
        if (!isValid && group) group.classList.add('error');
      } else {
        isValid = field.value.trim() !== '';
        if (!isValid && group) group.classList.add('error');
      }
      if (!isValid) valid = false;
    });
    return valid;
  }
  nextBtn.addEventListener('click', function () {
    if (validateStep(currentStep)) { currentStep++; showStep(currentStep); }
  });
  prevBtn.addEventListener('click', function () {
    currentStep--; if (currentStep < 1) currentStep = 1; showStep(currentStep);
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateStep(currentStep)) return;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Versturen…';
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
      .then(function (response) {
        if (response.ok) {
          form.style.display = 'none';
          formNav.style.display = 'none';
          var prog = document.getElementById('formProgress');
          if (prog) prog.style.display = 'none';
          formSuccess.classList.add('show');
        } else { throw new Error('Versturen mislukt'); }
      })
      .catch(function () {
        alert('Aanvraag niet verstuurd. Probeer Instagram @salafiaath.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Aanvraag versturen';
      });
  });
  showStep(1);
});
