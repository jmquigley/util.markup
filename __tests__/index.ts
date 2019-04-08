"use strict";

import {foo} from "../index";

test("Base empty test case", () => {
	foo();
	expect(true).toBe(true);
});
