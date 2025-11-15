package com.pioneerpicks.pioneerpicks.search;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/search")
class SearchController {

    private final SearchService searchService;

    public SearchController(
            SearchService searchService
    ) {
        this.searchService = searchService;
    }

    @GetMapping
    public ResponseEntity<Map<Object, Object>> getSearchResults(
            @RequestParam(required = true) String q
    ) {
        return searchService.getSearchResults(q);
    }

}
