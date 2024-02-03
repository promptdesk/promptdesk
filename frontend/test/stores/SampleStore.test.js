import { act } from 'react-dom/test-utils';
import { sampleStore } from '@/stores/SampleStore'; // Adjust the path as necessary

describe('sampleStore tests', () => {
    // Test for fetchSamples method
    describe('fetchSamples', () => {
        it('should fetch samples with default parameters', async () => {
            let samples;
            await act(async () => {
                samples = await sampleStore.getState().fetchSamples(1, '656577645b9fbfdddf32b1ae');
            });
            expect(samples).toBeDefined();
            expect(Array.isArray(samples)).toBe(true);
            expect(samples.length).toBeGreaterThan(3);
        });

    });

});