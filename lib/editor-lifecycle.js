(function () {
  'use strict';

  let installed = false;
  let lastActiveModel = null;

  function cleanModels(preferred) {
    const editorApi = window.monaco?.editor;
    if (!editorApi?.getModels) return;
    const models = editorApi.getModels().filter((model) => !model.isDisposed?.());
    const keep = preferred && !preferred.isDisposed?.() ? preferred : models[models.length - 1] || null;
    if (!keep) return;
    lastActiveModel = keep;
    for (const model of models) {
      if (model !== keep) {
        try { model.dispose(); } catch (_) {}
      }
    }
  }

  function install() {
    const editorApi = window.monaco?.editor;
    if (!editorApi?.onDidCreateModel || installed) return false;
    installed = true;

    editorApi.onDidCreateModel((model) => {
      lastActiveModel = model;
      queueMicrotask(() => cleanModels(model));
      setTimeout(() => cleanModels(model), 0);
    });

    const existing = editorApi.getModels?.() || [];
    if (existing.length) cleanModels(existing[existing.length - 1]);

    window.InterviewLabEditor = {
      getActiveModel() {
        const models = editorApi.getModels?.().filter((model) => !model.isDisposed?.()) || [];
        if (lastActiveModel && !lastActiveModel.isDisposed?.() && models.includes(lastActiveModel)) return lastActiveModel;
        return models[models.length - 1] || null;
      },
      modelCount() {
        return (editorApi.getModels?.() || []).filter((model) => !model.isDisposed?.()).length;
      },
      cleanup() {
        cleanModels(this.getActiveModel());
      }
    };
    return true;
  }

  const timer = setInterval(() => {
    if (install()) clearInterval(timer);
  }, 25);
  setTimeout(() => clearInterval(timer), 30000);
})();
