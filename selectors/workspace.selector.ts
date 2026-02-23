export const WorkspaceSelectors = {
    // === Role-based Locators ===
    widgetsButton: 'role=button[name="Widgets"]',
    apiButtonExact: 'role=button[name="API"s]',
    chatbotButtonExact: 'role=button[name="Chatbot"s]',
    knowledgeBaseButton: 'role=button[name="Knowledge base"]',
    authKeyButton: 'role=button[name="Auth Key"]',
    apiKeysButton: 'role=button[name="API Keys"]',
    alertsButton: 'role=button[name="alerts"]',
    metricsButton: 'role=button[name="metrics"]',
    gtwyAsEmbedButton: 'role=button[name="GTWY as Embed"]',
    apiAgentsHeading: 'role=heading[name="API Agents"]',
    searchAgentsInput: 'role=textbox[name="Search Agents by Name, SlugName, Service, or ID"s]',
    deleteAgentButton: 'role=button[name="Delete Agent"]',
    chatbotAgentsHeading: 'role=heading[name="Chatbot Agents"]',

    // === Data-TestId-based Locators ===
    createNewAgentButton: 'data-testid=create-new-agent-button',
    deleteModalConfirmButton: 'data-testid=delete-modal-confirm-button',
    externalLink: 'data-testid=smart-link-external-link',
    anyAgentTableRow: 'css=[data-testid^="custom-table-row-"]',
};