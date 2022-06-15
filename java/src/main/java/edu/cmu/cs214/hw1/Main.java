package edu.cmu.cs214.hw1;

import edu.cmu.cs214.hw1.cards.CardStatus;
import edu.cmu.cs214.hw1.cards.FlashCard;
import edu.cmu.cs214.hw1.cli.UI;
import edu.cmu.cs214.hw1.data.CardLoader;
import edu.cmu.cs214.hw1.data.CardStore;
import edu.cmu.cs214.hw1.ordering.CardDeck;
import edu.cmu.cs214.hw1.ordering.CardOrganizer;
import edu.cmu.cs214.hw1.ordering.CombinedCardOrganizer;
import edu.cmu.cs214.hw1.ordering.prioritization.CardShuffler;
import edu.cmu.cs214.hw1.ordering.prioritization.MostMistakesFirstSorter;
import edu.cmu.cs214.hw1.ordering.prioritization.RecentMistakesFirstSorter;


import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import edu.cmu.cs214.hw1.ordering.repetition.NonRepeatingCardOrganizer;
import edu.cmu.cs214.hw1.ordering.repetition.RepeatingCardOrganizer;
import org.apache.commons.cli.Option;
import org.apache.commons.cli.HelpFormatter;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.DefaultParser;


public final class Main {

    private Main() {
        // Disable instantiating this class.
        throw new UnsupportedOperationException();
    }


    public static void main(String[] args) throws IOException {
        //***Definition Stage***
        Option help = new Option("h", "help", false, "Show this help");
        Option order = new Option("o", "order", true,"The type of ordering to use, default \"random\"\n" +
                "[choices: \"random\", \"worst-first\", \"recent-mistakes-first\"]");
        Option repetition = new Option("r", "repetitions", true, "The number of times to each card should be answered successfully. " +
                "If not provided, every card is presented once, regardless of the correctness of the answer.");
        Option invert = new Option("i", "invertCards", false, "If set, it flips answer and question for each card. That is, it" +
                "prompts with the card's answer and asks the user to provide the corresponding question. " +
                "Default: false");
        Option file = new Option("f", "file", true, "The name of the csv file which contains cards. Default: \"designpatterns.csv\". " +
                "The file should in cards folder.");


        Options options = new Options();
        options.addOption(help);
        options.addOption(order);
        options.addOption(repetition);
        options.addOption(invert);
        options.addOption(file);

        //***Parsing Stage***
        CommandLineParser parser = new DefaultParser();
        try {
            CommandLine cmd = parser.parse(options, args);
            //***Interrogation Stage***
            //Option: --help
            if (cmd.hasOption(help.getLongOpt())) {
                HelpFormatter formatter = new HelpFormatter();
                formatter.printHelp("flashcard <cards-file> [options]", options);
            }

            //Option: --file
            String pathname = "cards/designpatterns.csv";
            if (cmd.hasOption(file.getLongOpt())) {
                pathname = "cards/" + cmd.getOptionValue(file.getLongOpt());
            }
            CardStore cards = new CardLoader().loadCardsFromFile(new File(pathname));

            //Option: --invertCards
            if (cmd.hasOption(invert.getLongOpt())) {
                cards = cards.invertCards();
            }

            //Option: --order & --repetitions
            List<CardOrganizer> cardOrganizers = new ArrayList<>();
            if (!cmd.hasOption(order.getLongOpt())) {
                cardOrganizers.add(new CardShuffler());
            } else {
                String prioritization = cmd.getOptionValue(order.getLongOpt());
                if ("random".equals(prioritization)) {
                    cardOrganizers.add(new CardShuffler());
                } else if ("worst-first".equals(prioritization)) {
                    cardOrganizers.add(new MostMistakesFirstSorter());
                } else if ("recent-mistakes-first".equals(prioritization)) {
                    cardOrganizers.add(new RecentMistakesFirstSorter());
                }
            }

            if (!cmd.hasOption(repetition.getLongOpt())) {
                cardOrganizers.add(new NonRepeatingCardOrganizer());
            } else {
                String times = cmd.getOptionValue(repetition.getLongOpt());
                cardOrganizers.add(new RepeatingCardOrganizer(Integer.parseInt(times)));
            }
            CardOrganizer combinedCardOrganizer = new CombinedCardOrganizer(cardOrganizers);
            CardDeck cardDeck = new CardDeck(cards.getAllCards(), combinedCardOrganizer);

            new UI().studyCards(cardDeck);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
