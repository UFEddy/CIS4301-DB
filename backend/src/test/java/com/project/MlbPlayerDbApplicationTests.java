package com.project;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = MlbPlayerDbApplication.class)
@ActiveProfiles("test")  // Use the "test" profile during tests
class MlbPlayerDbApplicationTests {

	@Test
	void contextLoads() {
	}

}
