import { act } from 'react-dom/test-utils';
import { variableStore } from '@/stores/VariableStore'; // Adjust the path as necessary

describe('variableStore tests', () => {
    // Test for fetchVariables method
    describe('fetchVariables', () => {
        it('should fetch variables and update the store', async () => {
            let variables;
            await act(async () => {
                variables = await variableStore.getState().fetchVariables();
            });
            expect(variables).toBeDefined();
            expect(Array.isArray(variables)).toBe(true);

            // Verify that the store's state has been updated
            const { variables: stateVariables } = variableStore.getState();
            expect(stateVariables).toBeDefined();
            expect(stateVariables).toEqual(variables);
        });
    });

    // Test for updateVariables method
    describe('updateVariables', () => {
        it('should update variables and update the store', async () => {
            //get original variables
            let originalVariables;
            await act(async () => {
                originalVariables = await variableStore.getState().fetchVariables();
            });
            const newVariables = [{ name: 'TestVar1', value: 'TestValue1' }, { name: 'TestVar2', value: 'TestValue2' }];
            await act(async () => {
                await variableStore.getState().updateVariables(newVariables);
            });

            // Verify that the store's state has been updated
            const { variables } = variableStore.getState();
            expect(variables).toEqual(newVariables);
            
            //reset variables to original state
            await act(async () => {
                await variableStore.getState().updateVariables(originalVariables);
            });

            // Verify that the store's state has been updated
            const { variables: stateVariables } = variableStore.getState();
            expect(stateVariables).toEqual(originalVariables);
        });
    });

    // Additional tests for error handling, edge cases, etc.
});
