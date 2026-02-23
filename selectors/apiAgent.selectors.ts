export const ApiAgentCreateSelectors = {
  mySpace: 'text=My space',
  createAgentButton: 'role=button[name="+ Create New API Agent"]',
  agentTable: '#custom-table-view',
  sidebar: '#default-agent-sidebar',
  agentPurposeInput: 'role=textbox[name="Agent purpose description"]',
  createButton: 'role=button[name="Create Agent"]',

  apiToggleButton: '#main-slider-toggle-button',
  apiModeButton: 'role=button[name="API"]',

  agentMenuButton: 'role=button[aria-haspopup="menu"]',
  deleteAgentButton: 'role=button[name="Delete Agent"]',
  deleteConfirmButton: 'role=button[name="Delete"]',

  systemPromptTextarea: 'textarea[data-testid="system-prompt"]',
};
