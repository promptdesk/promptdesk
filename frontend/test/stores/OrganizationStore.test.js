import { act } from 'react-dom/test-utils';
import { organizationStore } from '@/stores/OrganizationStore'; // Adjust the path as necessary

describe('organizationStore tests', () => {
    // Test for fetchOrganization method
    describe('fetchOrganization', () => {
        it('should fetch an organization and update the store', async () => {
            let organization;
            await act(async () => {
                organization = await organizationStore.getState().fetchOrganization();
            });
            expect(organization).toBeDefined();
            expect(organization).toHaveProperty('id'); // Assuming Organization has an id property
            expect(organization).toHaveProperty('name'); // Assuming Organization has a name property

            // Verify that the store's state has been updated
            const { organization: stateOrganization } = organizationStore.getState();
            expect(stateOrganization).toBeDefined();
            expect(stateOrganization).toEqual(organization);
        });
    });

});
