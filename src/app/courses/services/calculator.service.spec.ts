import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";
import { TestBed } from "@angular/core/testing";

describe("CalculatorService", () => {
  let calculator: CalculatorService;
  let loggerServiceSpy: jasmine.SpyObj<LoggerService>;

  beforeEach(() => {
    const loggerSpy = jasmine.createSpyObj("LoggerService", ["log"]);

    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        {
          provide: LoggerService,
          useValue: loggerSpy,
        },
      ],
    });

    calculator = TestBed.inject(CalculatorService);
    loggerServiceSpy = TestBed.inject(
      LoggerService
    ) as jasmine.SpyObj<LoggerService>;
  });

  it("should add 2 numbers", () => {
    const result = calculator.add(2, 2);

    expect(result).toBe(4);

    expect(loggerServiceSpy.log).toHaveBeenCalledTimes(1);
  });

  it("should subtract 2 numbers", () => {
    const result = calculator.subtract(2, 2);

    expect(result).toBe(0, "unexpected subtraction result");
    expect(loggerServiceSpy.log).toHaveBeenCalledTimes(1);
  });
});
