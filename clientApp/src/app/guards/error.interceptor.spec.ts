import { TestBed } from '@angular/core/testing';

import { ErrorInterceptor } from './error-interceptor.service';

describe('AuthInterceptor', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [ErrorInterceptor],
		})
	);

	it('should be created', () => {
		const interceptor: ErrorInterceptor = TestBed.inject(ErrorInterceptor);
		expect(interceptor).toBeTruthy();
	});
});
