<template>
    <Button label="Rules & Definitions" outlined @click="showRules = true" />

    <Dialog v-model:visible="showRules" modal header="VITL SIGNS" ref="rd">
        <div>
            <div class="grid grid-cols-3 gap-4">
                <div>
                    <div>
                        <h4>SALES EXECUTION</h4>
                        <p class="pl-2">45 total points possible</p>
                    </div>
                    <div>
                        <h5>SALES GOAL</h5>
                        <ul class="pl-4">
                            <li>Points Possible: 35</li>
                            <li>Target for Full Points: 3 sales/active rep/month.</li>
                            <li>Minimum Required to Score: 50%</li>
                        </ul>
                    </div>
                    <div>
                        <h5>Personal Production</h5>
                        <ul class="pl-4">
                            <li>Points Possible: 10</li>
                            <li>Target for Full Points: 10 sales/month.</li>
                            <li>Minimum Required to Score: 4 sales/month.</li>
                        </ul>
                    </div>
                    <div>
                        <h5>Self-Gen (SG) %*</h5>
                        <ul class="pl-4">
                            <li>Points Possible: 5</li>
                            <li>Target for Full Points: 30%</li>
                            <li>Minimum Required to Score: 10%</li>
                        </ul>
                        <p class="pl-2">*% of sales that came from self-generated leads</p>
                    </div>
                </div>

                <div>
                    <div>
                        <h4>TEAM DEVELOPMENT</h4>
                        <p class="pl-2">35 total points possible</p>
                    </div>
                    <div>
                        <h5>Projected Realization Rate (PRR)*</h5>
                        <ul class="pl-4">
                            <li>Points Possible: 10</li>
                            <li>Target for Full Points: 60%</li>
                            <li style="max-width: 360px;">Minimum Required to Score: 50% *% of sales expected to be
                                installed based on pipeline stage.
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h5>Vivint Attach Rate (VAR)</h5>
                        <ul class="pl-4">
                            <li>Points Possible: 5</li>
                            <li>Target for Full Points: 25%</li>
                            <li>No Minimum Required to Score.</li>
                        </ul>
                    </div>
                    <div>
                        <h5>Personal Installs Points Possible: 10</h5>
                        <ul class="pl-4">
                            <li>Target for Full Points: 6/month</li>
                            <li>Minimum Required to Score: 2/month</li>
                        </ul>
                    </div>
                    <div>
                        <h5>Clean %</h5>
                        <ul class="pl-4">
                            <li>Points Possible: 15</li>
                            <li>Target for Full Points: 100%</li>
                            <li>Minimum Required to Score: 60%</li>
                        </ul>
                    </div>
                </div>

                <div>
                    <div>
                        <h4>INSTALL QUALITY</h4>
                        <p class="pl-2">25 total points possible</p>
                    </div>
                    <div>
                        <h5>Reps With A Sale (RWS) %</h5>
                        <ul class="pl-4">
                            <li>Points Possible: 15</li>
                            <li>Target for Full Points: 100%</li>
                            <li>Minimum Required to Score: 60%</li>
                        </ul>
                    </div>
                    <div>
                        <h5>Net PPW to Target*</h5>
                        <ul class="pl-4">
                            <li>Points Possible: 10</li>
                            <li>Target for Full Points: 100%</li>
                            <li>Minimum Required to Score: 80%</li>
                        </ul>
                    </div>
                    <div>
                        <h5>Total PPW/Total Suggested PPW*</h5>
                        <div class="flex gap-3">
                            <table>
                                <thead>
                                    <tr>
                                        <th>State</th>
                                        <th>Suggested Sale Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>AR</td>
                                        <td>3.4</td>
                                    </tr>
                                    <tr>
                                        <td>AZ</td>
                                        <td>3.6</td>
                                    </tr>
                                    <tr>
                                        <td>CA</td>
                                        <td>4</td>
                                    </tr>
                                    <tr>
                                        <td>CO</td>
                                        <td>3.6</td>
                                    </tr>
                                    <tr>
                                        <td>CT</td>
                                        <td>3.6</td>
                                    </tr>
                                    <tr>
                                        <td>DC</td>
                                        <td>4</td>
                                    </tr>
                                    <tr>
                                        <td>DE</td>
                                        <td>4</td>
                                    </tr>
                                    <tr>
                                        <td>FL</td>
                                        <td>3.6</td>
                                    </tr>
                                    <tr>
                                        <td>GA</td>
                                        <td>3.6</td>
                                    </tr>
                                    <tr>
                                        <td>ID</td>
                                        <td>3.4</td>
                                    </tr>
                                    <tr>
                                        <td>IL</td>
                                        <td>3.4</td>
                                    </tr>
                                    <tr>
                                        <td>MA</td>
                                        <td>4</td>
                                    </tr>
                                    <tr>
                                        <td>MD</td>
                                        <td>4</td>
                                    </tr>
                                    <tr>
                                        <td>ME</td>
                                        <td>4</td>
                                    </tr>
                                </tbody>
                            </table>
                            <table>
                                <thead>
                                    <tr>
                                        <th>State</th>
                                        <th>Suggested Sale Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>NH</td>
                                        <td>4</td>
                                    </tr>
                                    <tr>
                                        <td>NJ</td>
                                        <td>4</td>
                                    </tr>
                                    <tr>
                                        <td>NM</td>
                                        <td>3.6</td>
                                    </tr>
                                    <tr>
                                        <td>NV</td>
                                        <td>3.6</td>
                                    </tr>
                                    <tr>
                                        <td>OH</td>
                                        <td>3.6</td>
                                    </tr>
                                    <tr>
                                        <td>OR</td>
                                        <td>3.6</td>
                                    </tr>
                                    <tr>
                                        <td>PA</td>
                                        <td>3.6</td>
                                    </tr>
                                    <tr>
                                        <td>RI</td>
                                        <td>4</td>
                                    </tr>
                                    <tr>
                                        <td>SC</td>
                                        <td>3.6</td>
                                    </tr>
                                    <tr>
                                        <td>TX</td>
                                        <td>3.6</td>
                                    </tr>
                                    <tr>
                                        <td>UT</td>
                                        <td>3.4</td>
                                    </tr>
                                    <tr>
                                        <td>VA</td>
                                        <td>3.6</td>
                                    </tr>
                                    <tr>
                                        <td>VT</td>
                                        <td>4</td>
                                    </tr>
                                    <tr>
                                        <td>WI</td>
                                        <td>3.6</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-6">
                <h4>GENERAL RULES</h4>
                <ul style="max-width: 800px;" class="pl-4">
                    <li>If you do not meet the minimum requirement, you will get zero points in that category.</li>
                    <li>You cannot score more than the listed "Points Possible" in one category, even if you are higher than
                        the target.</li>
                    <li>STARTING IN V2 TO BE UPDATED SOON: Metrics will automatically calculate based on the timeframe you
                        are
                        looking at. In the instance you are looking at a view less than a month, those targets will adjust
                        to
                        reflect the searched timeframe. ie: Personal production target is 10/ month. If going off a 10 day
                        grind
                        it would be ~3.3 since it's about a third of the month.</li>
                </ul>
            </div>
            <div class="mt-3">
                <h4>EXAMPLE</h4>
                <ul style="max-width: 800px;" class="pl-4">
                    <li>
                        <p>Personal Production:</p>
                        <ul class="pl-4">
                            <li>
                                Viewing 3 months: You had an average of 3/month. You receive zero points in this category.
                            </li>
                            <li>
                                Viewing 1 month: You had 8. You receive 8 points in the category.
                            </li>
                            <li>
                                Viewing a 10 day Grind: The target will be adjusted into 10 days rather than a month, making
                                the target ~3. If during those 10 days you had 2 sales you would receive 6.67pts
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </Dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useMainStore } from '../store/mainStore';


const store = useMainStore();
const { showRules } = storeToRefs(store);
</script>

<style scoped lang="scss">
p,
ul {
    font-size: 14px;
}

th,
td {
    font-size: 12px;
}

li {
    margin-top: 4px;
    line-height: 1.5;
}

h4,
h5,
p,
li {
    letter-spacing: 0.4px;
}
</style>
