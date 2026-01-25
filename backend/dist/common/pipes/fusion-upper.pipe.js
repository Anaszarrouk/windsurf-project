"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FusionUpperPipe = void 0;
const common_1 = require("@nestjs/common");
let FusionUpperPipe = class FusionUpperPipe {
    transform(value, metadata) {
        if (Array.isArray(value)) {
            return value.join('-').toUpperCase();
        }
        if (typeof value === 'string') {
            return value.toUpperCase();
        }
        return value;
    }
};
exports.FusionUpperPipe = FusionUpperPipe;
exports.FusionUpperPipe = FusionUpperPipe = __decorate([
    (0, common_1.Injectable)()
], FusionUpperPipe);
//# sourceMappingURL=fusion-upper.pipe.js.map