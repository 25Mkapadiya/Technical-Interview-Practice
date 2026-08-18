(function () {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  function currentProblem() {
    const heading = $('.problem-heading h1');
    if (!heading) return null;
    const title = heading.textContent.replace(/^\s*\d+\.\s*/, '').trim();
    const contextual = window.InterviewLabContext?.currentProblem;
    if (contextual?.title === title) return contextual;

    const difficulty = $('.problem-meta-row .badge:not(.neutral)')?.textContent?.trim() || 'Medium';
    try {
      return window.ProblemEngine?.enrich({ id: 'ui-current', order: 0, title, topic: '', difficulty }) || { title, guide: {} };
    } catch {
      return { title, guide: {} };
    }
  }

  function renderSolution() {
    const container = $('#leftContent');
    if (!container) return;

    $$('.pane-tabs .tab-btn').forEach((button) => button.classList.remove('active'));
    const solutionButton = $('[data-solution-tab]');
    if (solutionButton) solutionButton.classList.add('active');

    if ($('.mode-toggle')?.classList.contains('on')) {
      container.innerHTML = '<div class="locked-panel"><div><strong>Solution hidden</strong><br>Turn off Interview Mode when you are ready to review the explanation.</div></div>';
      return;
    }

    const problem = currentProblem();
    if (!problem || !window.SolutionEngine) {
      container.innerHTML = '<div class="empty-state">Solution explanation could not be loaded.</div>';
      return;
    }

    const solution = window.SolutionEngine.explain(problem);
    container.innerHTML = `
      <p class="eyebrow">Solution explanation</p>
      <h1>${escapeHtml(problem.title)}</h1>
      <div class="problem-meta-row" style="margin-bottom:14px">
        <span class="badge neutral">${escapeHtml(solution.level)}</span>
        <span class="badge neutral">${escapeHtml(solution.time)}</span>
        <span class="badge neutral">${escapeHtml(solution.space)}</span>
      </div>
      <div class="learn-card">
        <h3>Intuition</h3>
        <p>${escapeHtml(solution.intuition)}</p>
      </div>
      <div class="learn-card">
        <h3>Brute force</h3>
        <p>${escapeHtml(solution.bruteForce)}</p>
      </div>
      <div class="learn-card">
        <h3>Optimal approach</h3>
        <ol class="evidence-list">${solution.optimalSteps.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol>
      </div>
      <div class="learn-card">
        <h3>Pseudocode</h3>
        <pre class="example-box">${escapeHtml(solution.pseudocode)}</pre>
      </div>
      <div class="complexity-grid">
        <div class="complexity-metric"><span>Expected time</span><strong>${escapeHtml(solution.time)}</strong></div>
        <div class="complexity-metric"><span>Expected space</span><strong>${escapeHtml(solution.space)}</strong></div>
      </div>
      <div class="learn-card">
        <h3>How to verify your solution</h3>
        <ul class="evidence-list">${solution.verification.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      </div>
      ${solution.level === 'pattern-level' ? '<div class="settings-note">This problem currently uses a pattern-level explanation. The canonical source link in Description remains the authority for exact constraints and wording.</div>' : ''}
    `;
  }

  function installSolutionTab() {
    const tabs = $('.pane-tabs');
    if (!tabs || $('[data-solution-tab]', tabs)) return;
    const button = document.createElement('button');
    button.className = 'tab-btn';
    button.type = 'button';
    button.dataset.solutionTab = 'true';
    button.textContent = 'Solution';
    const complexity = $('[data-left-tab="complexity"]', tabs);
    tabs.insertBefore(button, complexity || null);
  }

  document.addEventListener('click', (event) => {
    const solutionButton = event.target.closest('[data-solution-tab]');
    if (solutionButton) {
      event.preventDefault();
      event.stopPropagation();
      renderSolution();
      return;
    }
    const normalTab = event.target.closest('[data-left-tab]');
    if (normalTab) $('[data-solution-tab]')?.classList.remove('active');
  }, true);

  const observer = new MutationObserver(() => installSolutionTab());
  const main = $('#mainView');
  if (main) observer.observe(main, { childList: true, subtree: true });
  installSolutionTab();
})();
