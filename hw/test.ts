import * as _ from "underscore";
import { Widget } from "./db";
import { Context } from "./strategy";
import { getWidget } from "./hw-refactoring-code";
import { StrategyWithLoop } from "./StrategyWithLoop";

const deepEqual = require("deep-equal");
const context = new Context(new StrategyWithLoop());

async function test() {

    const expected1 = [
        await getWidget("1", "1", "1") as Widget,
        await getWidget("1", "1", "2") as Widget,
        await getWidget("1", "1", "3") as Widget,
        await getWidget("1", "1", "4") as Widget
    ];
    const res1 = await context.getDataLinkWidgetsChain(await getWidget("1", "1", "1") as Widget);

    console.assert(
        deepEqual(_.sortBy(expected1, x => x.uuid), _.sortBy(res1, x => x.uuid)), 
        "Test 1 fail"
    );

    const expected2 = [
        await getWidget("1", "1", "7") as Widget
    ]
    const res2 = await context.getDataLinkWidgetsChain(await getWidget("1", "1", "7") as Widget);

    console.assert(
        deepEqual(_.sortBy(expected2, x => x.uuid), _.sortBy(res2, x => x.uuid)), 
        "Test 2 fail"
    );

    const expected3 = [
        await getWidget("1", "1", "5") as Widget,
        await getWidget("1", "1", "6") as Widget
    ]
    const res3 = await context.getDataLinkWidgetsChain(await getWidget("1", "1", "6") as Widget);

    console.assert(
        deepEqual(_.sortBy(expected3, x => x.uuid), _.sortBy(res3, x => x.uuid)), 
        "Test 2 fail"
    );
}

test()
    .then(() => console.log("Passed"))
    .catch(err => console.error(err));
